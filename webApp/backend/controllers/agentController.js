const agentService = require('../services/agentService');

exports.getAllAgent = (req, res) => {
    res.json(agentService.getAgents());
}