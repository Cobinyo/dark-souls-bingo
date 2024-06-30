const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let boards = {};

io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('joinBoard', (boardId) => {
        socket.join(boardId);
        if (!boards[boardId]) {
            boards[boardId] = {};
        }
        io.to(socket.id).emit('initialBoard', boards[boardId]);
    });

    socket.on('markCell', ({ boardId, index, color }) => {
        if (!boards[boardId]) {
            boards[boardId] = {};
        }
        if (!boards[boardId][index]) {
            boards[boardId][index] = [];
        }
        boards[boardId][index].push(color);
        io.to(boardId).emit('updateCell', { index: index, colors: boards[boardId][index] });
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

app.use(express.static('public'));

server.listen(4000, () => console.log(`Server is running on port 4000`));
