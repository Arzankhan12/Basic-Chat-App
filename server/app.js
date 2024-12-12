import express from 'express';
import { Server } from 'socket.io';
import { createServer } from 'http';
import cors from 'cors';

const app = express();
const port = 3000;

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Update to your frontend URL if needed
    methods: ["GET", "POST"],
    credentials: true
  }
});

io.on("connection", (socket) => {
  console.log("User connected", socket.id);

  // Listen for messages from the client
  socket.on("message", ({room,message}) => {
    io.to(room).emit("receive-message",message);
    console.log(`Message from ${{room,message}}`); // Logs the message in the terminal
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected ${socket.id}`);
  });

  
  socket.on("join-room",(room)=>{
    socket.join(room)
    console.log(`user joined ${room}`)
  })
});

server.listen(port, (err) => {
  if (err) {
    console.error('Server failed to start', err);
  } else {
    console.log(`Server is running on port ${port}`);
  }
});
