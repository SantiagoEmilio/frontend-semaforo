import machine
import dht
import time
import urequests
def programa_ht11():
    pass
def enviar_datos(datos):
    url = 'https://semaforo-3da01-default-rtdb.firebaseio.com/'
    response = urequests.patch(url, json=datos)
    response.close()
sensor = dht.DHT11(machine.Pin(16))
while True:
    try:
        sensor.measure()
        temp = sensor.temperature()
        hum = sensor.humidity()

        enviar_datos({
            "hum": hum,
            "temp": temp
        })
        print("Temperatura: {} °C".format(temp))
        print("Humedad: {} %".format(hum))
    except OSError as e:
        print("Error al leer el sensor:", e)
    time.sleep(2)
    programa_ht11()

import urequests
def obtener_estado(url):
    try:
        r = urequests.get(url)
        if r.status_code == 200:
            estado = r.json()
            r.close()
            return estado
    except:
        pass
    return None

import network
import time
def conectar(ssid, pwd):
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    wlan.connect(ssid, pwd)
    start = time.time()
    while not wlan.isconnected():
        if time.time() - start > 10:
            return False
        time.sleep(1)
    return True

