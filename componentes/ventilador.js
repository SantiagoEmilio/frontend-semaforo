export function ventiladorLosDatos(ventiladorDatos) {
    const FIREBASE_URL = "https://semaforo-3da01-default-rtdb.firebaseio.com/.json";

    let datosDiv = document.querySelector(".datos");
    if (!datosDiv) {
        datosDiv = document.createElement("div");
        datosDiv.classList.add("datos");

        const tempPara = document.createElement("p");
        const humPara = document.createElement("p");

        tempPara.innerHTML = `Temperatura: <span id="temperatura">--</span>`;
        humPara.innerHTML = `Humedad: <span id="humedad">--</span>`;

        const ventiladorImg = document.createElement("img");
        ventiladorImg.id = "ventilador";
        ventiladorImg.src = "https://img1.picmix.com/output/stamp/normal/8/8/5/4/1634588_32eb6.gif";
        ventiladorImg.alt = "Ventilador";

        datosDiv.appendChild(tempPara);
        datosDiv.appendChild(humPara);
        datosDiv.appendChild(ventiladorImg);

        ventiladorDatos.appendChild(datosDiv); // aquí lo metemos junto al semáforo
    }

    fetch(FIREBASE_URL)
        .then(response => response.json())
        .then(data => {
            if (data) {
                const temperatura = data.temperatura || '--';
                const humedad = data.humedad || '--';

                document.getElementById("temperatura").innerText = `${temperatura}`;
                document.getElementById("humedad").innerText = `${humedad}`;

                const ventilador = document.getElementById("ventilador");
                if (temperatura >= 30) {
                    ventilador.classList.add("girar");
                } else {
                    ventilador.classList.remove("girar");
                }
            }
        })
        .catch(error => {
            console.error("Error al obtener los datos de Firebase:", error);
        });
}
