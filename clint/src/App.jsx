import React, { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import {
  Container,
  Button,
  TextField,
  Typography,
  Box,
  Stack,
} from "@mui/material";

const App = () => {
  // Use memo to avoid re-creating the socket on every render
  const socket = useMemo(() => io("http://localhost:3000"), []);

  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [socketId, setSocketId] = useState("");
  const [messages, setMessages] = useState([]);
  const [roomName, setRoomName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", { message, room }); // Send message to the server
    setMessage(""); // Clear the message input
  };
  const joinRoomHandler = (e) => {
    e.preventDefault();
    socket.emit("join-room", roomName);
  };

  useEffect(() => {
    socket.on("connect", () => {
      setSocketId(socket.id); // Set the socket ID when connected
      console.log("Connected", socket.id);
    });

    socket.on("message", (data) => {
      console.log("Received message:", data);
    });
    socket.on("receive-message", (data) => {
      console.log(data);
      setMessages((messages) => [...messages, data]);
    });
    socket.on("welcome", (msg) => {
      console.log(msg);
    });

    // Clean up the socket connection on component unmount
    return () => {
      socket.disconnect();
    };
  }, [socket]); // Added [socket] to ensure it's not called repeatedly

  return (
    <Container>
      <Typography variant="h4" component="div" gutterBottom>
        Welcome to the Chat App
      </Typography>

      <Typography variant="h5" component="div" gutterBottom>
        {socketId}
      </Typography>

      <form onSubmit={joinRoomHandler}>
        <TextField
          id="message-input"
          label="Room Name"
          type="text"
          fullWidth
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
        />
        <Button type="submit" variant="contained" color="primary">
          join
        </Button>
      </form>

      <form onSubmit={handleSubmit}>
        <TextField
          id="message-input"
          label="Enter your message"
          type="text"
          fullWidth
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <TextField
          id="message-input"
          label="Room"
          type="text"
          fullWidth
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        />
        <Button type="submit" variant="contained" color="primary">
          Send
        </Button>
      </form>

      <Stack>
        {messages.map((message, id) => (
          <Typography key={id} variant="h6" component="div" color="primary">
            {message}
          </Typography>
        ))}
      </Stack>
    </Container>
  );
};

export default App;
