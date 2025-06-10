from machine import Pin
import time

class Semaforo:
    def _init_(self, r, y, g):
        self.r = Pin(r, Pin.OUT)
        self.y = Pin(y, Pin.OUT)
        self.g = Pin(g, Pin.OUT)
        self.apagar()
    
    def apagar(self):
        self.r.off()
        self.y.off()
        self.g.off()
    
    def rojo(self, dur=5):
        self.apagar()
        self.r.on()
        print("LED Rojo encendido")
        time.sleep(dur)
    
    def verde(self, dur=5):
        self.apagar()
        self.g.on()
        print("LED Verde encendido")
        time.sleep(dur)
    
    def amarillo_parpadeo(self, veces=5, dur=0.5):
        self.apagar()
        print("LED Amarillo parpadeando")
        for _ in range(veces):
            self.y.on()
            time.sleep(dur)
            self.y.off()
            time.sleep(dur)
    
    def amarillo_encendido(self, dur=3):
        self.apagar()
        self.y.on()
        print("LED Amarillo encendido")
        time.sleep(dur)
    
    def ciclo(self):
        print("Ejecutando ciclo completo...")
        self.rojo(4)
        self.amarillo_encendido(2)
        self.verde(4)
        self.amarillo_encendido(1)
