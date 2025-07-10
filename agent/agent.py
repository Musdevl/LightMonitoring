import asyncio
from fastapi import FastAPI
import psutil
import requests
import socket
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import httpx

backendUrl = "http://localhost:9000"

hostname = socket.gethostname()
ip = "127.0.0.1"
SLEEP_TIME = 5

running = True
metrics_task = None

async def register_agent():
    try:
        agent_data = {
            "hostname": hostname,
            "ip": ip
        }
        requests.post(f"{backendUrl}/agent/register", json=agent_data)
        print(f"Agent registered: {hostname}")
    except Exception as e:
        print(f"Registration failed: {e}")

async def unregister_agent():
    try:
        requests.delete(f"{backendUrl}/agent/unregister", json={
             "hostname": hostname
        }, timeout = 10)
        print(f"Agent unregistered: {hostname}")
    except Exception as e:
        print(f"Unregistration failed: {e}")

@asynccontextmanager
async def lifespan(app: FastAPI):
    await register_agent()
    """metrics_task = asyncio.create_task(push_metrics_periodically())
    yield
    global running
    running = False
    metrics_task.cancel()"""
    yield
    await unregister_agent()


def collect_metrics():
    return {
        "hostname": hostname,
        "cpu": psutil.cpu_percent(),
        "ram": psutil.virtual_memory()._asdict(),
        "disk": psutil.disk_usage("/")._asdict(),
        "net": psutil.net_io_counters()._asdict()
    }

async def push_metrics_periodically():
    while running:
        try:
            metrics = collect_metrics()
            response = requests.post(f"{backendUrl}/agent/metrics", json=metrics)
            print("📤 Metrics sent")
        except Exception as e:
            print(f"❌ Failed to send metrics: {e}")
        await asyncio.sleep(SLEEP_TIME)






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