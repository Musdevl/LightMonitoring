const express = require('express');
const http = require('http');
const cors = require('cors');
const app = express();
const port = 9000;

const agentRouter = require("./routes/agentRouter");
const socketManager = require("./socketManager");


// Add CORS middleware BEFORE other middleware
app.use(cors({
    origin: "http://localhost:4200",
    credentials: true
}));


app.use(express.json());
app.use("/agent", agentRouter);

const server = http.createServer(app);
socketManager.initSocket(server);

server.listen(port, () => {
    console.log(`🚀 Serveur Express lancé sur http://localhost:${port}`);
});