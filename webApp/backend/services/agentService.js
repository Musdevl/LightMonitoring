const pool = require("../db");
const agentScheduler = require("../agentScheduler");
let agents = {};

exports.getAgents = () => agents;

exports.saveAgent = async (val) => {
    console.log("New agent : " + val.hostname);

    const { hostname, ip, config } = val;
    const location = config?.location || null;
    const refreshInterval = config?.refreshInterval ?? 5000;


    try {

        const checkExist = await pool.query(
            "SELECT * FROM agents WHERE hostname = $1",
            [hostname]
        );
        if (checkExist.rowCount === 0) {
            const result = await pool.query(
                "INSERT INTO agents (hostname, ip, config_location, config_refresh_interval) VALUES ($1, $2, $3, $4) RETURNING *",
                [hostname, ip, location, refreshInterval]
            );
        }

        agents[hostname] = val;
    } catch (err) {
        if (err.code === "23505") {
            console.log(`[Agent Service] - Agent "${hostname}" déjà existant dans la database`);
            throw new Error("Agent déjà enregistré");
        } else {
            console.error("[Agent Service] - Erreur SQL :", err);
            throw err;
        }
    }

    await agentScheduler.createAgentSchedule(val);
};

exports.deleteAgent = async (hostname) => {
    console.log("Agent deleted : " + hostname);

    await agentScheduler.deleteAgentSchedule(agents[hostname]);

    delete agents[hostname];

};
