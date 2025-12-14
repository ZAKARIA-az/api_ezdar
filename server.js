const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const { setIo } = require('./services/notificationService');

const server = http.createServer(app);
const io = new Server(server);

setIo(io);

const PORT = process.env.PORT || 5000;

io.on('connection', (socket) => {
  const userId = socket.handshake.query.userId;
  if (userId) {
    socket.join(userId.toString());
  }

  console.log('User connected:', socket.id, 'userId:', userId);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

module.exports = { io };
