const socketIO = require('socket.io');

let io;

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
        });
    });
};

exports.getIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized!');
    }
    return io;
};
