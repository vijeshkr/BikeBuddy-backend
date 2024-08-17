const { Server } = require('socket.io');
const http = require('http');
const express = require('express');

const app = express();

const server = http.createServer(app);

// Initialize socket io server with cors configuration
const io = new Server(server,{
    cors:{
        origin:[process.env.FRONTEND_URL],
        methods:["GET","POST"]
    }
});

// Array to store active connections with socket id and user id
let connections = [];

const getSocketIdByUserId = (userId) => {
    const connection = connections.find(conn => conn.userId === userId);
    return connection ? connection.socketId : null;
};

// Function for add new connection to the array
const addConnection = (userId, socketId) => {
    !connections.some((user) => user.userId === userId) &&
    connections.push({userId, socketId});
}

// Remove connection
const removeConnection = (socketId) => {
    connections = connections.filter((user) => user.socketId !== socketId);
}

io.on('connection',(socket) => {
    console.log('Connected');

    // Take user id and socket id from the user and push to the array
    socket.on("addConnection", (userId) => {
        addConnection(userId, socket.id);
      });

    socket.on('disconnect',() => {
        console.log('disconnected');
        removeConnection(socket.id);
    })
});

module.exports =  { app, io, server, getSocketIdByUserId}