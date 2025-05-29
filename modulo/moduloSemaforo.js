export function moduloSemaforo(estado, nombredelcolor) {
  let moduSemaforo = document.createElement('div');
  moduSemaforo.className = `div-semaforo ${estado}`;

  let textoSemaforo = document.createElement('p');
  textoSemaforo.className = "nombre-de-color";
  textoSemaforo.innerHTML = nombredelcolor;

  moduSemaforo.appendChild(textoSemaforo);
  return moduSemaforo;
}
