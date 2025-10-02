// Socket.io connection yönetimi

const setupSocketIO = (io) => {
  io.on("connection", (socket) => {
    console.log(`✅ Socket connected: ${socket.id}`);

    // Kullanıcı kendi room'una katılır
    socket.on("join", (userId) => {
      socket.join(`user_${userId}`);
      console.log(`👤 User ${userId} joined their room`);
    });

    socket.on("disconnect", () => {
      console.log(`❌ Socket disconnected: ${socket.id}`);
    });
  });
};

// Belirli bir kullanıcıya emit
const emitToUser = (io, userId, event, data) => {
  if (io) {
    io.to(`user_${userId}`).emit(event, data);
  }
};

module.exports = {
  setupSocketIO,
  emitToUser
};
