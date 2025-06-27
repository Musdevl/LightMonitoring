const express = require('express');
const app = express();
const port = 9000;

const agentRouter = require("./routes/agentRouter")

app.use("/agent", agentRouter);

app.listen(port, () => {
    console.log(`🚀 Serveur Express lancé sur http://localhost:${port}`);
});
