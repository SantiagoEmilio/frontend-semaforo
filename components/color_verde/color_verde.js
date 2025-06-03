export function crearVerde() {
  const luzVerde = document.createElement("div");
  luzVerde.className = "luz verde";
  luzVerde.id = "verde";
  return luzVerde;
}

export async function obtenerEstadoVerde() {
  const url = "http://localhost:3000/semaforo/led3";

  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.led3 === 1 ? 1 : 0;
  } catch (error) {
    console.error("Error obteniendo estado verde:", error);
    return 0;
  }
}

export function iniciarMonitoreoVerde() {
  setInterval(async () => {
    const led = await obtenerEstadoVerde();
    const verde = document.getElementById("verde");
    verde.classList.toggle("on", led === 1);
  }, 1000);
}
