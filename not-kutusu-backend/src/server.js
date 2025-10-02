require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");
const app = require("./app");
const connectDB = require("./config/db");
const { startMonthlyResetJob } = require("./jobs/monthlyReset");
const { setupSocketIO } = require("./services/socketService");

const PORT = process.env.PORT || 5050;

// HTTP server oluştur
const server = http.createServer(app);

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "*", // app.js ile uyumlu
    credentials: true,
    methods: ["GET", "POST"]
  }
});

// Global io instance (gamification için)
global.io = io;

// Socket.io connection yönetimi
setupSocketIO(io);

// App'e io'yu ekle (controller'larda kullanmak için)
app.set("io", io);

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 Socket.io ready for connections`);

    // Aylık puan sıfırlama cron job'unu başlat
    startMonthlyResetJob();
  });
});
