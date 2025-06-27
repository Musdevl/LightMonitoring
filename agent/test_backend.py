import requests

url = "http://localhost:9000/agent/register"

agent_data = {
    "hostname": "pc-test-python",
    "ip": "192.168.0.101",
}

try:
    response = requests.post(url, json=agent_data)
    response.raise_for_status()
    print("✅ Agent enregistré :", response.json())
except requests.exceptions.HTTPError as errh:
    print("❌ Erreur HTTP :", errh.response.text)
except requests.exceptions.RequestException as err:
    print("❌ Erreur de requête :", err)
