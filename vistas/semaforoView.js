import { moduloSemaforo } from "../modulo/moduloSemaforo.js";

const secuencia = [
  ["semaforo-0", "a1"], // Rojo normal
  ["semaforo-0", "a2"], // Rojo fuerte
  ["semaforo-1", "a3"], // Amarillo normal
  ["semaforo-1", "a4"], // Amarillo fuerte
  ["semaforo-2", "a5"], // Verde normal
  ["semaforo-2", "a6"]  // Verde fuerte
];

// Crear módulos y agregarlos
["Rojo", "Amarillo", "Verde"].forEach((color, i) => {
  const semaforo = moduloSemaforo("", color);
  semaforo.id = `semaforo-${i}`;
  document.body.appendChild(semaforo);
});

let paso = 0;

document.addEventListener("click", () => {
  // Limpiar clases a1-a6
  for (let i = 0; i < 3; i++) {
    const el = document.getElementById(`semaforo-${i}`);
    el.className = "div-semaforo";
  }

  // Activar el color correspondiente
  const [id, clase] = secuencia[paso];
  document.getElementById(id).classList.add(clase);

  paso = (paso + 1) % secuencia.length;
});
