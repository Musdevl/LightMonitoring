const pool = require("./db");

const socketManager = require("./socketManager");
const axios = require("axios");

let agentsSchedule = new Map(); // (agent.hostname ; intervalId)


async function getData(agent){
    try{
        const response = await axios.get("http://" + agent.ip + ":8000/metrics");
        console.log('[Data] - Get metrics for ' + agent.hostname + " result : \n", response.data);
        return response.data;
    }
    catch(err){
        console.error('[Data] - Get metrics for ' + agent.hostname + " error : \n", err);
        return null;
    }
}


exports.createAgentSchedule = async (agent) => {
    console.log("Create agent schedule : ", agent);

    if(agentsSchedule.has(agent.hostname)){
        console.log("Agent already scheduled ", agent);
        return;
    }

    const refreshRate = agent.config?.refreshInterval ?? 5000;


    const intervalId = setInterval(async () => {
        // Get data
        let data = await getData(agent);
        if(data === null){ return }

        // Get agentId of DB
        let agentIdQuery = await pool.query("SELECT id FROM agents WHERE hostname = $1", [agent.hostname]);
        let agentId = agentIdQuery.rows[0].id;

        // Push data to DB
        await pool.query("INSERT INTO metrics (agent_id, cpu_usage, ram_used, ram_free, net_sent, net_recv, timestamp) VALUES ($1, $2, $3, $4, $5, $6, NOW())",
            [agentId, data.cpu, data.ram.used, data.ram.free, data.net.sent_per_sec, data.net.recv_per_sec]);

        // If watcher then send them new data
        if(socketManager.getWatchersMap().has(agent.hostname)){
            let socketList = socketManager.getWatchersMap().get(agent.hostname);
            for(let socket of socketList){
                socketManager.sendNewData(socket, data);
            }
        }


    }, refreshRate)
    agentsSchedule.set(agent.hostname, intervalId);

}


exports.deleteAgentSchedule = (agent) => {
    console.log("Delete agent schedule : ", agent);
    if(!agentsSchedule.has(agent.hostname)){
        console.log("Agent not scheduled cant remove it : ", agent);
        return;
    }
    clearInterval(agentsSchedule.get(agent.hostname));
    agentsSchedule.delete(agent.hostname);

}