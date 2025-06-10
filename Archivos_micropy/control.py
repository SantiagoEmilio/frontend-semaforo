import urequests

def obtener_estado(url):
    try:
        response = urequests.get(url)
        if response.status_code == 200:
            data = response.json()
            response.close()
            
            # Extraer el estado correctamente
            if isinstance(data, dict) and 'estado' in data:
                return data['estado']
            
        response.close()
    except Exception as e:
        print("Error obteniendo estado:", e)
    
    return None
