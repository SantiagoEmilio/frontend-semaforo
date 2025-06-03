// components/color_amarillo/color_amarillo.js

export function crearAmarillo() {
  const luzAmarilla = document.createElement("div");
  luzAmarilla.className = "luz amarillo";
  luzAmarilla.id = "amarillo";
  return luzAmarilla;
}

export async function obtenerEstadoAmarillo() {
  const url = "http://localhost:3000/semaforo/led2";

  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.led2 === 1 ? 1 : 0;
  } catch (error) {
    console.error("Error obteniendo estado amarillo:", error);
    return 0;
  }
}

export function iniciarMonitoreoAmarillo() {
  setInterval(async () => {
    const led = await obtenerEstadoAmarillo();
    const amarillo = document.getElementById("amarillo");
    amarillo.classList.toggle("on", led === 1);
  }, 1000);
}
