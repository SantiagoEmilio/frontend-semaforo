import { Roja } from "./componentes/rojo.js";
import { Amarilla } from "./componentes/amarillo.js";
import { Verde } from "./componentes/verde.js";
import { ventiladorLosDatos } from "./componentes/ventilador.js";

const FIREBASE_URL = "https://semaforo-3da01-default-rtdb.firebaseio.com/.json";
let estadoActual = "rojo";
let cicloActivo = true;
let cicloEnCurso = false;

// Crear contenedor general
const contenedorGeneral = document.createElement("div");
contenedorGeneral.className = "contenedor-general";
document.body.appendChild(contenedorGeneral);

function SemaforoModulo() {
    const semaforo = document.createElement("div");
    semaforo.className = "semaforo-Base";
    semaforo.appendChild(Roja());
    semaforo.appendChild(Amarilla());
    semaforo.appendChild(Verde());
    contenedorGeneral.appendChild(semaforo);
}

function botonesEnGeneral() {
    const divbotones = document.createElement("div");
    divbotones.className = "div-botonesControl";

    const btnDetener = document.createElement("button");
    btnDetener.className = "btnD";
    btnDetener.innerText = "Detener";
    divbotones.appendChild(btnDetener);
    btnDetener.onclick = () => cambiarEstado("detener");

    const btnRojo = document.createElement("button");
    btnRojo.className = "btnRojo";
    btnRojo.innerText = "C.Rojo";
    divbotones.appendChild(btnRojo);
    btnRojo.onclick = () => cambiarEstado("rojo");

    const btnAmarillo = document.createElement("button");
    btnAmarillo.className = "btnA";
    btnAmarillo.innerText = "C.Amarillo";
    divbotones.appendChild(btnAmarillo);
    btnAmarillo.onclick = () => cambiarEstado("amarillo");

    const btnVerde = document.createElement("button");
    btnVerde.className = "btnVerde";
    btnVerde.innerText = "C.Verde";
    divbotones.appendChild(btnVerde);
    btnVerde.onclick = () => cambiarEstado("verde");

    document.body.appendChild(divbotones);
}

function actualizacionDelSemaforo(color) {
    document.querySelectorAll('.luz').forEach(luz => {
        luz.classList.remove('activo');
        if (luz.classList.contains(color)) {
            luz.classList.add('activo');
        }
    });
}

async function cambiarEstado(color) {
    try {
        await fetch(FIREBASE_URL, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ estado: color })
        });
        console.log("Estado cambiado a:", color);
    } catch (error) {
        console.error("Error al actualizar Firebase:", error);
    }
}

async function iniciaFirebase() {
    setInterval(async () => {
        try {
            const response = await fetch(FIREBASE_URL);
            const data = await response.json();
            if (data?.estado && data.estado !== estadoActual) {
                estadoActual = data.estado;
                actualizacionDelSemaforo(estadoActual);
                cicloActivo = data.estado === "ciclo";
            }
        } catch (error) {
            console.error("Error leyendo Firebase:", error);
        }
    }, 1000);
}

async function cicloAutomatico() {
    if (!cicloActivo) return;

    const secuencia = [
        ["rojo", 3000],
        ["amarillo", 1000],
        ["verde", 3000],
        ["amarillo", 1000]
    ];

    for (const [color, duracion] of secuencia) {
        if (!cicloActivo) break;
        await cambiarEstado(color);
        actualizacionDelSemaforo(color);
        await new Promise(resolve => setTimeout(resolve, duracion));
    }
}

// Inicia el sistema
botonesEnGeneral();
SemaforoModulo();
ventiladorLosDatos(contenedorGeneral);
actualizacionDelSemaforo(estadoActual);
iniciaFirebase();

setInterval(() => {
    if (cicloActivo && !cicloEnCurso) {
        cicloEnCurso = true;
        cicloAutomatico().then(() => {
            cicloEnCurso = false;
        });
    }
}, 500);
