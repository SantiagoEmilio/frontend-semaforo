import machine
import dht
import time
import urequests
import json
from semaforo import Semaforo
from red import conectar
from control import obtener_estado

REDES = [
    {"ssid": "fogel", "pwd": "123456789"},
    {"ssid": "selp", "pwd": "12345678jhs"},
    {"ssid": "iPh0ne", "pwd": "rm123456"},
    {"ssid": "CLARO1_F966B8", "pwd": "B4495DP2VQ"},
    {"ssid": "iPhoneA", "pwd": "roarsita2007"}
]

URL = "https://semaforo-3da01-default-rtdb.firebaseio.com/.json"

s = Semaforo(15, 14, 13)
sensor = dht.DHT11(machine.Pin(16))
ultimo_estado = ""

def enviar_datos(datos):
    try:
        response = urequests.patch(URL, json=datos)
        print("Código de estado HTTP:", response.status_code)
        response.close()
        print("Datos enviados:", datos)
    except Exception as e:
        print("Error al enviar datos:", e)
        
        
def programa_ht11():
    try:
        sensor.measure()
        temp = sensor.temperature()
        hum = sensor.humidity()
        enviar_datos({
            "temp": temp,
            "hum": hum
        })
        print("Temperatura: {} °C, Humedad: {} %".format(temp, hum))
    except OSError as e:
        print("Error al leer el sensor:", e)

print("Conectando a WiFi...")
conectado = False
for red in REDES:
    print(f"Intentando {red['ssid']}...")
    if conectar(red["ssid"], red["pwd"]):
        conectado = True
        print("Conectado a WiFi.")
        break

if not conectado:
    print("No se pudo conectar a ninguna red. Entrando en modo local.")
    s.apagar()

print("Iniciando operación...")
while True:
    try:
        if conectado:
            estado_data = obtener_estado(URL)
            # Asegurarnos de que estado_data es un diccionario
            if isinstance(estado_data, str):
                try:
                    estado_data = json.loads(estado_data)
                except ValueError:
                    estado_data = None
                    print("Error: No se pudo parsear la respuesta JSON")
            
            estado = estado_data.get("estado") if estado_data and isinstance(estado_data, dict) else None
            programa_ht11()

            if estado and estado != ultimo_estado:
                print("Nuevo estado recibido:", estado)

                if estado == "rojo":
                    s.rojo()
                elif estado == "verde":  # Corregí "verde" (antes decía "verde")
                    s.verde()
                elif estado == "amarillo":
                    s.amarillo_encendido()
                elif estado == "ciclo":
                    for _ in range(2):
                        s.ciclo()
                        programa_ht11()
                elif estado == "detener":
                    s.apagar()

                ultimo_estado = estado
        else:
            for _ in range(2):
                s.ciclo()
                programa_ht11()

        time.sleep(2)

    except Exception as e:
        print("Error en bucle principal:", e)
        time.sleep(3)
