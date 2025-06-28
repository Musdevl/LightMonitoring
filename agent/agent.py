from fastapi import FastAPI
import psutil
from fastapi.middleware.cors import CORSMiddleware

backendUrl = "http://localhost:9000"


app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ou ["http://localhost:4200"] en production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/status")
def get_metrics():
    return {"status" : "ok"}

@app.get("/metrics")
def get_metrics():
    return {
        "cpu": psutil.cpu_percent(),
        "ram": psutil.virtual_memory()._asdict(),
        "disk": psutil.disk_usage("/")._asdict(),
        "net": psutil.net_io_counters()._asdict()
    }
