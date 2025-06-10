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
