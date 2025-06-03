import { crearSemaforo } from "./components/semaforo/semaforo.js";
function carga_dom() {
  let dom = document.querySelector("#root");
  dom.className = "dom";
  dom.appendChild(crearSemaforo());
  return dom;
}

carga_dom();
