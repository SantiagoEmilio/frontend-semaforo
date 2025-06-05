import { Roja } from "./componentes/rojo.js";
import { Amarilla } from "./componentes/amarillo.js";
import { Verde } from "./componentes/verde.js";

const FIREBASE_URL = "https://semaforooooo-c6eae-default-rtdb.firebaseio.com/.json";
let estadoActual = "rojo";
let cicloActivo = true;  // Variable para saber si el ciclo está activo


//modulos del semaforo
function SemaforoModulo() {
    const semaforo = document.createElement("div");
    semaforo.className = "semaforo-Base";
    semaforo.appendChild(Roja());
    semaforo.appendChild(Amarilla());
    semaforo.appendChild(Verde());
    document.body.appendChild(semaforo);
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


async function iniciaFirebase() {
    setInterval(async () => {
        try {
            const response = await fetch(FIREBASE_URL);
            const data = await response.json();
            if (data?.color && data.color !== estadoActual) {
                estadoActual = data.color;
                actualizacionDelSemaforo(estadoActual);

                if (estadoActual === "detener") {
                    cicloActivo = false;  // Detenemos el ciclo automático
                    console.log("Semáforo detenido");
                } else if (estadoActual === "ciclo") {
                    cicloActivo = true;  // Reanudamos el ciclo automático
                    console.log("Ciclo automático reanudado");
                } else {
                    cicloActivo = false;  // Detenemos el ciclo si se recibe un color específico
                }
            }
        } catch (error) {
            console.error("Error leyendo Firebase:", error);
        }
    }, 1000);
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
            body: JSON.stringify({ color })
        });
        console.log("Estado cambiado a:", color);
    } catch (error) {
        console.error("Error al actualizar Firebase:", error);
    }
}


function cicloAutomatico() {
    if (!cicloActivo) return;  // Si el ciclo está detenido, no hacemos nada

    const secuencia = [("rojo", 3), ("amarillo", 1), ("verde", 3), ("amarillo", 1)];
    for (const [color, duracion] of secuencia) {
        if (!cicloActivo) return;  // Si el ciclo se detuvo mientras, salimos

        console.log(`Encendiendo ${color} por ${duracion} segundos`);
        cambiarEstado(color);  // Aquí cambia el estado en Firebase
        actualizacionDelSemaforo(color);
        setTimeout(() => {}, duracion * 1000);
    }
}

botonesEnGeneral();
SemaforoModulo();
actualizacionDelSemaforo(estadoActual);
iniciaFirebase();
setInterval(cicloAutomatico, 1000); 
