// validations/agentSchema.js
const Joi = require('joi');

const agentSchema = Joi.object({
    hostname: Joi.string().min(1).required(),
    ip: Joi.string().ip({ version: ['ipv4'] }).required(),
    config: Joi.object({
        location: Joi.string().optional(),
        refreshInterval: Joi.number().min(50).max(60000).default(5000),
    }).optional().default({ refreshInterval: 5000 }),
});

module.exports = agentSchema;