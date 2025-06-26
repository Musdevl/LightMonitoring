const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Server } = require('socket.io');
const http = require("http")

const app = express();
const port = 9000;

// Def pour les socket

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:4200',
        methods: ['GET', 'POST']
    }
});

app.use(cors({ origin: 'http://localhost:4200' })); // Autorise Angular
app.use(bodyParser.json());

// Mémoire temporaire
const agents = {};


// Enregistrement d’un agent
app.post('/api/register', (req, res) => {
    const data = req.body;
    if (!data.hostname) return res.status(400).json({ error: "hostname manquant" });

    agents[data.hostname] = data;
    console.log("Agent enregistré :", data);
    res.json({ message: `Agent ${data.hostname} enregistré.` });
    
});







// Retourne tous les agents
app.get('/api/agents', (req, res) => {
    res.json(Object.values(agents));
});

// Lancement du serveur
app.listen(port, () => {
    console.log(`🚀 Serveur Express lancé sur http://localhost:${port}`);
});
