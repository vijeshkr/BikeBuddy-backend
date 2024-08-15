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

io.on('connection',(socket) => {
    console.log('Connected');

    socket.on('disconnect',() => {
        console.log('disconnected');
    })
});

module.exports =  { app, io, server}