const express = require("express");
const http = require("http");
const { Server } = require("socket.io");


const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
    },
});

app.use(express.static("public"));

var now_date = new Date();

io.on("mensaje", (socket) => {
    console.log("nueva conexión", socket.id, " a las: ", now_date.toLocaleString());

    socket.on("mensaje", (data) => {
        console.log("Usuario conectado:", socket.id, " a las: ", now_date.toLocaleString());
        io.emit("mensaje", { message: "Nuevo usuario conectado", id: socket.id });
    });

});

server.listen(3000, () => {
  console.log("🚀 Servidor en http://localhost:3000");
});
