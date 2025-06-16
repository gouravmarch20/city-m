const { Server } = require("socket.io");
const setupSocket = (server) => {
  const io = new Server(server, { cors: { origin: "*" } });
  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);
  });
};
module.exports = { setupSocket };
