export function ventiladorLosDatos(contenedor) {
  const FIREBASE_URL = "https://semaforo-3da01-default-rtdb.firebaseio.com/.json";

  let datosDiv = document.querySelector(".datos");
  if (!datosDiv) {
    datosDiv = document.createElement("div");
    datosDiv.classList.add("datos");

    const tempPara = document.createElement("p");
    const humPara = document.createElement("p");

    tempPara.innerHTML = `Temperatura: <span id="temperatura">--</span>°C`;
    humPara.innerHTML = `Humedad: <span id="humedad">--</span>%`;

    const ventiladorImg = document.createElement("img");
    ventiladorImg.id = "ventilador";
    ventiladorImg.src = "https://previews.123rf.com/images/tiler84/tiler841202/tiler84120200012/12376310-modern-electric-metallic-fan-isolated-on-white-background.jpg";
    ventiladorImg.alt = "Ventilador";

    datosDiv.appendChild(tempPara);
    datosDiv.appendChild(humPara);
    datosDiv.appendChild(ventiladorImg);

    contenedor.appendChild(datosDiv);
  }

  async function actualizarDatos() {
    try {
      const response = await fetch(FIREBASE_URL);
      const data = await response.json();

      console.log("Datos recibidos de Firebase:", data); // 👈 Para depuración

      if (data) {
        const temperatura = data.Temperatura ?? '--';
        const humedad = data.Humedad ?? '--';

        document.getElementById("temperatura").innerText = `${temperatura}`;
        document.getElementById("humedad").innerText = `${humedad}`;

        const ventilador = document.getElementById("ventilador");
        const tempNum = parseFloat(temperatura);

        if (!isNaN(tempNum)) {
          if (tempNum >= 30) {
            ventilador.classList.add("girar-rapido");
            ventilador.classList.remove("girar-lento");
          } else if (tempNum > 0 && tempNum < 30) {
            ventilador.classList.add("girar-lento");
            ventilador.classList.remove("girar-rapido");
          } else {
            ventilador.classList.remove("girar-lento");
            ventilador.classList.remove("girar-rapido");
          }
        }
      }
    } catch (error) {
      console.error("Error al obtener los datos de Firebase:", error);
    }
  }

  actualizarDatos(); // llamada inicial
  setInterval(actualizarDatos, 2000); // actualización cada 2 segundos
}
