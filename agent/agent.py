import asyncio
from fastapi import FastAPI
import psutil
import requests
import socket
from fastapi.middleware.cors import CORSMiddleware

backendUrl = "http://localhost:9000"
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

hostname = socket.gethostname()
ip = "127.0.0.1"
SLEEP_TIME = 5

running = True
metrics_task = None

def register_agent():
    try:
        agent_data = {
            "hostname": hostname,
            "ip": ip
        }
        requests.post(f"{backendUrl}/agent/register", json=agent_data)
        print(f"Agent registered: {hostname}")
    except Exception as e:
        print(f"Registration failed: {e}")

def unregister_agent():
    try:
        requests.delete(f"{backendUrl}/agent/unregister/", json={
            "hostname": hostname
        })
        print(f"Agent unregistered: {hostname}")
    except Exception as e:
        print(f"Unregistration failed: {e}")

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


@app.on_event("startup")
async def startup():
    global metrics_task
    register_agent()
    metrics_task = asyncio.create_task(push_metrics_periodically())

@app.on_event("shutdown")
async def shutdown():
    global running
    global metrics_task
    running = False
    unregister_agent()
    if metrics_task:
        await metrics_task

@app.get("/status")
def get_status():
    return {"status": "ok"}

@app.get("/metrics")
def get_metrics():
    return collect_metrics()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
