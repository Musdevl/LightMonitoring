let agents = {}

exports.getAgents = () => Object.values(agents);

exports.saveAgent = (val) => {
    agents[val.hostname] = val;
}