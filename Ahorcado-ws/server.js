// server.js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

io.on("connection", (socket) => {
  console.log("🔌 Usuario conectado:", socket.id);

  socket.on("mensaje", (msg) => {
    console.log("📨 Mensaje recibido:", msg);
    io.emit("mensaje", msg); // Enviar a todos los clientes
  });

  socket.on("disconnect", () => {
    console.log("❌ Usuario desconectado:", socket.id);
  });
});

server.listen(3000, () => {
  console.log("🚀 Servidor en http://locaalhost:3000");
});
