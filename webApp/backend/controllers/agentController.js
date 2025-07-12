const agentService = require('../services/agentService');
const agentSchema = require("../models/agentModel")
const socketManager = require("../socketManager")

exports.getAllAgent = (req, res) => {
    res.json(agentService.getAgents());
}

exports.createAgent = async (req, res) => {
    const { error, value } = agentSchema.validate(req.body);
    if (error) {
        return res.status(400).json({"error" : "Model de schema non respecté", "details" : error.details});
    }

    await agentService.saveAgent(value);

    socketManager.getIO().emit("new_agent");
    res.status(200).json({"message" : "Agent correctement enregistré ", "agent" : value});
}

exports.deleteAgent = (req, res) => {
    let data = req.body;
    if(!data.hostname){
        return res.status(400).json({"error" : "Hostname manquant"});
    }
    agentService.deleteAgent(data.hostname);
    socketManager.getIO().emit("delete_agent");
    res.status(200).json({"message" : "Agent correctement supprimé"})

}