import { Roja } from "./componentes/rojo.js";
import { Amarilla } from "./componentes/amarillo.js";
import { Verde } from "./componentes/verde.js";

const FIREBASE_URL = "https://semaforooooo-c6eae-default-rtdb.firebaseio.com/.json";
let estadoActual = "rojo";



function SemaforoGeneral() {
    const semaforoModulo = document.createElement("div");
    semaforoModulo.className = "semaforo-Base";

    semaforoModulo.appendChild(Roja());

    semaforoModulo.appendChild(Amarilla());

    semaforoModulo.appendChild(Verde());

    document.body.appendChild(semaforoModulo);
}


function inicioDelFirebase() {
    setInterval(async () => {
        try {
            const response = await fetch(FIREBASE_URL);
            const data = await response.json();
            if (data?.color && data.color !== estadoActual) {
                estadoActual = data.color;
                actualizacionDelSemaforo(estadoActual);
            }
        } catch (error) {
            console.error("Error al leer  Firebase:", error);
        }
    }, 1000);
}

function botonesEnGeneral() {
    const divbotones = document.createElement("div")
    divbotones.className = "div-botonesControl"

    const btnDetener = document.createElement("button");
    btnDetener.className = "btnDetener";
    btnDetener.innerText = "Deten";
    divbotones.appendChild(btnDetener)

    const btnRojo = document.createElement("button");
    btnRojo.className = "btnRojo";
    btnRojo.innerText = "C.Rojo";
    divbotones.appendChild(btnRojo)

    const btnAmarillo = document.createElement("button");
    btnAmarillo.className = "btnAmarillo";
    btnAmarillo.innerText = "C.Amarillo";
    divbotones.appendChild(btnAmarillo)

    const btnVerde = document.createElement("button");
    btnVerde.className = "btnVerde";
    btnVerde.innerText = "C.Verde";
    divbotones.appendChild(btnVerde)

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
    estadoActual = color;
    actualizacionDelSemaforo(color);
    try {
        await fetch(FIREBASE_URL, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ color })
        });
    } catch (error) {
        console.error("Error al momento de  actualizar Firebase:", error);
    }
}



botonesEnGeneral();
inicioDelFirebase()
SemaforoGeneral();
actualizacionDelSemaforo(estadoActual);
