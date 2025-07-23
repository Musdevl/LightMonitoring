import asyncio
from multiprocessing.pool import worker

from fastapi import FastAPI
import psutil
import requests
import socket
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import httpx
import time
import json

backendUrl = "http://localhost:9000"

hostname = socket.gethostname()
ip = "127.0.0.1"
SLEEP_TIME = 5

running = True
metrics_task = None

async def register_agent():
    async with httpx.AsyncClient() as client:
        try:
            agent_data = {
                "hostname": hostname,
                "ip": ip
            }
            response = await client.post(f"{backendUrl}/agent/register", json=agent_data)
            response.raise_for_status() # en gros regarde si c'est bien code 200 et pas erreur 300, 400, 500 ...
            print(f"Agent registered: {hostname}")
        except Exception as e:
            print(f"Registration failed: {e}")

async def unregister_agent():
    async with httpx.AsyncClient() as client:
        try:
            response = await client.delete(f"{backendUrl}/agent/unregister/{hostname}", timeout=10)
            response.raise_for_status()
            print(f"Agent unregistered: {hostname}")
        except Exception as e:
            print(f"Unregistration failed: {e}")


@asynccontextmanager
async def lifespan(app: FastAPI):
    await register_agent()
    yield
    await unregister_agent()


last_net = psutil.net_io_counters()
last_time = time.time()

def collect_metrics():
    global last_net, last_time

    # Temps écoulé
    current_time = time.time()
    elapsed = current_time - last_time
    last_time = current_time

    # Lecture des valeurs réseau actuelles
    current_net = psutil.net_io_counters()

    # Calcul des vitesses par seconde
    net_sent_speed = (current_net.bytes_sent - last_net.bytes_sent) / elapsed
    net_recv_speed = (current_net.bytes_recv - last_net.bytes_recv) / elapsed
    last_net = current_net

    return {
        "hostname": socket.gethostname(),
        "cpu": psutil.cpu_percent(interval=0.1), # Bloque le programme 0.1 sec pour mesure le CPU
        "ram": {
            "used": round(psutil.virtual_memory().used / 1024 / 1024), # En Mo
            "free": round(psutil.virtual_memory().available / 1024 / 1024), # En Mo
        },
        "net": {
            "sent_per_sec": round(net_sent_speed),
            "recv_per_sec": round(net_recv_speed)
        }
    }







app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)





@app.get("/status")
def get_status():
    return {"status": "ok"}

@app.get("/metrics")
def get_metrics():
    return collect_metrics()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)