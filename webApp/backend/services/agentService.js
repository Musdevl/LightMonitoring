let agents = {}

exports.getAgents = () => Object.values(agents);

exports.saveAgent = (val) => {
    console.log("New agent : " + val.hostname);
    agents[val.hostname] = val;
}