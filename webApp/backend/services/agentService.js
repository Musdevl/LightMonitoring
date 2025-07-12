const pool = require("../db");

let agents = {};

exports.getAgents = () => Object.values(agents);

exports.saveAgent = async (val) => {
    console.log("New agent : " + val.hostname);

    const { hostname, ip, config } = val;
    const location = config?.location || null;
    const refreshInterval = config?.refreshInterval ?? 5000;

    try {
        const result = await pool.query(
            "INSERT INTO agents (hostname, ip, config_location, config_refresh_interval) VALUES ($1, $2, $3, $4) RETURNING *",
            [hostname, ip, location, refreshInterval]
        );

        agents[hostname] = val;
        return result.rows[0]; // retour utile si besoin
    } catch (err) {
        if (err.code === "23505") {
            console.log(`[Agent Service] - Agent "${hostname}" déjà existant`);
            throw new Error("Agent déjà enregistré");
        } else {
            console.error("[Agent Service] - Erreur SQL :", err);
            throw err;
        }
    }
};

exports.deleteAgent = async (hostname) => {
    console.log("Agent deleted : " + hostname);
    try {
        await pool.query("DELETE FROM agents WHERE hostname = $1", [hostname]);
    } catch (err) {
        console.error("[Agent Service] - Erreur suppression DB :", err);
    }
    delete agents[hostname];
};
