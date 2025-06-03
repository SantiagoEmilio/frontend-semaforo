const FIREBASE_URL = 'https://base-167fb-default-rtdb.firebaseio.com/';
const COLOR_ENDPOINT = FIREBASE_URL + 'color.json';
const HISTORIAL_ENDPOINT = FIREBASE_URL + 'historial.json';


const luzRojo = document.getElementById('luz-rojo');
const luzAmarillo = document.getElementById('luz-amarillo');
const luzVerde = document.getElementById('luz-verde');
const estadoElement = document.getElementById('estado');
const colorActualElement = document.getElementById('color-actual');
const ultimaActualizacionElement = document.getElementById('ultima-actualizacion');
const btnConectar = document.getElementById('btn-conectar');
const btnHistorial = document.getElementById('btn-historial');
const historialElement = document.getElementById('historial');
const historialLista = document.getElementById('historial-lista');

// ===================================
// VARIABLES GLOBALES
// ===================================
let estadoConexion = false;
let ultimoColor = '';
let intervaloPrincipal;
let intervaloHeartbeat;
let historialVisible = false;

// ===================================
// FUNCIONES PRINCIPALES
// ===================================

function inicializar() {
    console.log('🚦 Iniciando Semáforo Inteligente...');
    actualizarEstado('Iniciando...', 'warning');

    btnConectar.addEventListener('click', reconectar);
    btnHistorial.addEventListener('click', toggleHistorial);

    iniciarMonitoreo();
    cargarHistorial();

    console.log('✅ Aplicación inicializada correctamente');
}

function iniciarMonitoreo() {
    intervaloPrincipal = setInterval(obtenerEstadoSemaforo, 3000);
    intervaloHeartbeat = setInterval(verificarConexion, 30000);
    obtenerEstadoSemaforo();
}

async function obtenerEstadoSemaforo() {
    try {
        const response = await fetch(COLOR_ENDPOINT);
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

        const data = await response.json();
        if (data && data.color) {
            procesarDatosSemaforo(data);
            if (!estadoConexion) {
                actualizarEstado('Conectado', 'success');
                estadoConexion = true;
            }
        } else {
            throw new Error('Datos no válidos recibidos');
        }
    } catch (error) {
        console.error('❌ Error al obtener estado del semáforo:', error);
        manejarErrorConexion();
    }
}

function procesarDatosSemaforo(data) {
    const color = data.color.toLowerCase();
    const timestamp = data.timestamp;

    if (color !== ultimoColor) {
        console.log(`🔄 Cambio de color: ${ultimoColor} → ${color}`);
        cambiarColorSemaforo(color);
        ultimoColor = color;

        colorActualElement.textContent = color.toUpperCase();
        colorActualElement.style.color = obtenerColorHex(color);
    }

    if (timestamp) {
        const fecha = new Date(timestamp * 1000);
        ultimaActualizacionElement.textContent = formatearFecha(fecha);
    }
}

function cambiarColorSemaforo(color) {
    apagarTodasLasLuces();
    setTimeout(() => {
        switch(color) {
            case 'rojo':
                luzRojo.classList.add('activo');
                reproducirSonido('rojo');
                console.log('🔴 Luz ROJA activada');
                break;
            case 'amarillo':
                luzAmarillo.classList.add('activo');
                reproducirSonido('amarillo');
                console.log('🟡 Luz AMARILLA activada');
                break;
            case 'verde':
                luzVerde.classList.add('activo');
                reproducirSonido('verde');
                console.log('🟢 Luz VERDE activada');
                break;
            default:
                console.warn('⚠️ Color no reconocido:', color);
        }
    }, 200);
}

function apagarTodasLasLuces() {
    luzRojo.classList.remove('activo');
    luzAmarillo.classList.remove('activo');
    luzVerde.classList.remove('activo');
}

function manejarErrorConexion() {
    if (estadoConexion) {
        actualizarEstado('Desconectado', 'error');
        estadoConexion = false;
        console.log('📴 Modo offline activado');
        colorActualElement.textContent = 'SIN DATOS';
        ultimaActualizacionElement.textContent = 'Sin conexión';
    }
}

function actualizarEstado(mensaje, tipo = 'info') {
    estadoElement.textContent = mensaje;
    estadoElement.className = `value ${tipo}`;
    switch(tipo) {
        case 'success':
            estadoElement.style.color = '#4ade80'; break;
        case 'error':
            estadoElement.style.color = '#ef4444'; break;
        case 'warning':
            estadoElement.style.color = '#f59e0b'; break;
        default:
            estadoElement.style.color = '#ffffff';
    }
}

async function verificarConexion() {
    try {
        const response = await fetch(COLOR_ENDPOINT);
        if (!response.ok) throw new Error('Heartbeat failed');
        console.log('💚 Heartbeat: Conexión OK');
    } catch (error) {
        console.warn('💔 Heartbeat: Error de conexión');
        manejarErrorConexion();
    }
}

function reconectar() {
    console.log('🔄 Reconectando...');
    actualizarEstado('Reconectando...', 'warning');
    if (intervaloPrincipal) clearInterval(intervaloPrincipal);
    if (intervaloHeartbeat) clearInterval(intervaloHeartbeat);
    setTimeout(() => iniciarMonitoreo(), 1000);
}

async function cargarHistorial() {
    try {
        const response = await fetch(HISTORIAL_ENDPOINT);
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
        const data = await response.json();
        if (data) mostrarHistorial(data);
    } catch (error) {
        console.error('❌ Error al cargar historial:', error);
        historialLista.innerHTML = '<p>❌ Error al cargar historial</p>';
    }
}

function mostrarHistorial(data) {
    historialLista.innerHTML = '';
    const historialArray = Object.values(data)
        .filter(item => item && item.color && item.timestamp)
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 10);

    if (historialArray.length === 0) {
        historialLista.innerHTML = '<p>📭 No hay datos en el historial</p>';
        return;
    }

    historialArray.forEach(item => {
        const div = document.createElement('div');
        div.className = `historial-item ${item.color}`;
        const fecha = new Date(item.timestamp * 1000);
        const colorIcon = obtenerIconoColor(item.color);
        div.innerHTML = `
            <span>${colorIcon} ${item.color.toUpperCase()}</span>
            <span>${formatearFecha(fecha)}</span>
        `;
        historialLista.appendChild(div);
    });
}

function toggleHistorial() {
    historialVisible = !historialVisible;
    if (historialVisible) {
        historialElement.classList.add('visible');
        btnHistorial.textContent = '❌ Ocultar Historial';
        cargarHistorial();
    } else {
        historialElement.classList.remove('visible');
        btnHistorial.textContent = '📊 Ver Historial';
    }
}

function obtenerColorHex(color) {
    const colores = {
        'rojo': '#ef4444',
        'amarillo': '#f59e0b',
        'verde': '#22c55e'
    };
    return colores[color] || '#ffffff';
}

function obtenerIconoColor(color) {
    const iconos = {
        'rojo': '🔴',
        'amarillo': '🟡',
        'verde': '🟢'
    };
    return iconos[color] || '⚪';
}

function formatearFecha(fecha) {
    return fecha.toLocaleString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        day: '2-digit',
        month: '2-digit'
    });
}

function reproducirSonido(color) {
    if (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined') {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            const frecuencias = {
                'rojo': 200,
                'amarillo': 300,
                'verde': 400
            };

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.value = frecuencias[color] || 250;
            oscillator.type = 'sine';

            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.2);
        } catch (error) {
            console.warn("Error al reproducir sonido:", error);
        }
    }
}

// Ejecutar al cargar la página
window.addEventListener('DOMContentLoaded', inicializar);
