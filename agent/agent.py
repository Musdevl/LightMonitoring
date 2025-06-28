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

def register_agent():
    """Register this agent with the backend"""
    try:
        hostname = socket.gethostname()
        ip = "127.0.0.1"  # Simple IP for now
        
        agent_data = {
            "hostname": hostname,
            "ip": ip
        }
        
        response = requests.post(f"{backendUrl}/agent/register", json=agent_data)
        print(f"Agent registered: {hostname}")
        
    except Exception as e:
        print(f"Registration failed: {e}")

@app.get("/status")
def get_status():
    return {"status": "ok"}

@app.get("/metrics")
def get_metrics():
    return {
        "cpu": psutil.cpu_percent(),
        "ram": psutil.virtual_memory()._asdict(),
        "disk": psutil.disk_usage("/")._asdict(),
        "net": psutil.net_io_counters()._asdict()
    }

@app.on_event("startup")
async def startup():
    register_agent()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)