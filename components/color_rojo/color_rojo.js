// components/color_rojo/color_rojo.js

export function crearRojo() {
  const luzRoja = document.createElement("div");
  luzRoja.className = "luz rojo";
  luzRoja.id = "rojo";
  return luzRoja;
}

export async function obtenerEstadoRojo() {
  const url = "http://localhost:3000/semaforo/led1";

  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.led1 === 1 ? 1 : 0;
  } catch (error) {
    console.error("Error obteniendo estado rojo:", error);
    return 0;
  }
}

export function iniciarMonitoreoRojo() {
  setInterval(async () => {
    const led = await obtenerEstadoRojo();
    const rojo = document.getElementById("rojo");
    rojo.classList.toggle("on", led === 1);
  }, 1000);
}
