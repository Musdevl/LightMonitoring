const socketIO = require('socket.io');
const agentService = require('./services/agentService');

let io;

let agentWatched = new Map();

exports.getWatchersMap = () => agentWatched;

function addWatcher(agent, socket) {

    const hostname = agent.hostname;

    if (agentService.getAgents()[hostname]) {
        console.log('Agent watched:', hostname, " by : ", socket.id);

        if (!agentWatched.has(hostname)) {
            agentWatched.set(hostname, new Set());
        }

        agentWatched.get(hostname).add(socket.id);

    }
    else{
        console.log('Agent not found:', hostname);
        socket.emit('backend_error', {
            message: 'Agent not found',
            details: 'You asked to watch an agent that the backend does not know about.',
            from: 'socket_manager'
        })
    }
}

function deleteWatcher(agent, socket) {

    const hostname = agent.hostname;

    if (agentWatched.has(hostname)) {

        if(agentWatched.get(hostname).has(socket.id)){
            console.log('Agent unwatched:', hostname, " by : ", socket.id);
            agentWatched.get(hostname).delete(socket.id);
            //nettoyage de la map si plus de watcher:
            if(agentWatched.get(hostname).size === 0){
                agentWatched.delete(hostname);
            }
        }
        else{
            console.log('Watcher not found:', hostname);
            socket.emit('backend_error', {
                message: 'Watcher not found',
                details: 'You asked to unwatch an agent but you are not watching it.',
                from: 'socket_manager'
            })
        }

    }
    else{
        console.log('Agent not found:', hostname);
        socket.emit('backend_error', {
            message: 'Agent not found',
            details: 'You asked to unwatch an agent that the backend does not know about.',
            from: 'socket_manager'
        })
    }
}

function removeFantomWatcher(socketId) {
    for (const [hostname, watchers] of agentWatched.entries()) {
        if (watchers.has(socketId)) {
            watchers.delete(socketId);
            if (watchers.size === 0) {
                agentWatched.delete(hostname);
            }
        }
    }
}

exports.initSocket = (server) => {
    io = socketIO(server, {
        cors: {
            origin: "http://localhost:4200", // Your Angular app URL
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {
        console.log('Client connected with id:', socket.id);

        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
            removeFantomWatcher(socket.id);
        });

        socket.on('watch_agent', (agent) => {
            addWatcher(agent, socket)
        })

        socket.on('unwatch_agent', (agent) => {
           deleteWatcher(agent, socket)
        })
    });
};

exports.sendNewData = (socket, data) =>
    socket.emit('new_data', data);

exports.getIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized!');
    }
    return io;
};
