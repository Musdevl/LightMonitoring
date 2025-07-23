const agentService = require('../services/agentService');
const agentSchema = require("../models/agentModel")
const socketManager = require("../socketManager")
const {pool} = require("../db");

exports.getAllAgent = (req, res) => {
    res.json(Object.values(agentService.getAgents()));
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

exports.deleteAgent = async (req, res) => {
    const hostname = req.params.hostname; // récupère la string hostname

    if (!hostname) {
        return res.status(400).json({ "error": "Hostname manquant" });
    }

    try {
        await agentService.deleteAgent(hostname);
        socketManager.getIO().emit("delete_agent");
        res.status(200).json({ "message": "Agent correctement supprimé" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ "error": "Erreur serveur lors de la suppression" });
    }
};
