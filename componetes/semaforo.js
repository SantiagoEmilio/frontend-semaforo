const semaforo = document.createElement('div');
semaforo.className = 'semaforo';

// estado (0 = apagado, 1 = encendido)
let estadoRojo = 1;
let estadoAmarillo = 0;
let estadoVerde = 1;

const luzRoja = document.createElement('div');
luzRoja.className = 'luz roja';
semaforo.appendChild(luzRoja);

const luzAmarilla = document.createElement('div');
luzAmarilla.className = 'luz amarilla';
semaforo.appendChild(luzAmarilla);

const luzVerde = document.createElement('div');
luzVerde.className = 'luz verde';
semaforo.appendChild(luzVerde);

document.body.appendChild(semaforo);

// Control por valor
function actualizarSemaforo() {
  if (estadoRojo === 1) rojoEncendido(); else rojoApagado();
  if (estadoAmarillo === 1) amarilloEncendido(); else amarilloApagado();
  if (estadoVerde === 1) verdeEncendido(); else verdeApagado();
}


function rojoEncendido() {
  luzRoja.classList.add('encendida');
}
function rojoApagado() {
  luzRoja.classList.remove('encendida');
}
function amarilloEncendido() {
  luzAmarilla.classList.add('encendida');
}
function amarilloApagado() {
  luzAmarilla.classList.remove('encendida');
}
function verdeEncendido() {
  luzVerde.classList.add('encendida');
}
function verdeApagado() {
  luzVerde.classList.remove('encendida');
}

// Actualizar visual según valores iniciales
actualizarSemaforo();
