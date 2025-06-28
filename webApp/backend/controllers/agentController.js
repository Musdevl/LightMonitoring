const agentService = require('../services/agentService');
const agentSchema = require("../models/agentModel")
const socketManager = require("../socketManager")

exports.getAllAgent = (req, res) => {
    res.json(agentService.getAgents());
}

exports.createAgent = (req, res) => {
    const { error, value } = agentSchema.validate(req.body);
    if (error) {
        return res.status(400).json({"error" : "Model de schema non respecté", "details" : error.details});
    }

    agentService.saveAgent(value);
    res.status(200).json({"message" : "Agent correctement enregistré ", "agent" : value});

    socketManager.getIO().emit("new_agent");
}