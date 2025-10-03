const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { generalLimiter } = require("./middleware/rateLimiter");

const app = express();

// Trust proxy (Render.com için gerekli)
app.set('trust proxy', 1);

// Middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));

// 🎯 Geçici olarak CORS kaldırıldı (geliştirme için)
app.use(cors());

// 🎯 Sıkı CORS ayarı (geliştirme sonrası aktif edilecek)
// const allowedOrigins = [process.env.FRONTEND_URL];
// app.use(cors({
//   origin: function (origin, callback) {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error("CORS policy: Bu domain'e izin verilmiyor."));
//     }
//   },
//   credentials: true
// }));

// 📌 Admin route'u en başta tanımla (login token istemesin)
const adminRoutes = require("./routes/admin.routes");
app.use("/api/admin", adminRoutes); 

// 🎯 Global rate limiter (admin login hariç tüm /api için geçerli)
app.use("/api", generalLimiter);

// Routes
const authRoutes = require("./routes/auth.routes");
const testRoutes = require("./routes/test.routes");
const courseRoutes = require("./routes/course.routes");
const noteRoutes = require("./routes/note.routes");
const universityRoutes = require("./routes/university.routes");
const { swaggerUi, swaggerSpec, swaggerUiOptions, themeToggleScript } = require("./swagger");
const commentRoutes = require("./routes/comment.routes");
const userRoutes = require("./routes/user.routes");
const departmentCodeRoutes = require("./routes/departmentCode.routes");
const suggestionRoutes = require("./routes/suggestion.routes");
const uploadRoutes = require("./routes/upload.routes");
const scoreboardGameRoutes = require("./routes/scoreboardGame.routes");
const notificationRoutes = require("./routes/notification.routes");
const reactionRoutes = require("./routes/reaction.routes");

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api", courseRoutes);
app.use("/api", noteRoutes);
app.use("/api", universityRoutes);
app.use("/api", commentRoutes);
app.use("/api", userRoutes);
app.use("/api", departmentCodeRoutes);
app.use("/api", suggestionRoutes);
app.use("/api", uploadRoutes);
app.use("/api/gamification", scoreboardGameRoutes);
app.use("/api", notificationRoutes);
app.use("/api", reactionRoutes);

// Swagger dark/light tema için gerekli inline script
app.get("/swagger-theme-toggle.js", (req, res) => {
  res.type("application/javascript").send(themeToggleScript);
});

// Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));

// Test route (health check)
app.get("/ping", (req, res) => {
  res.json({ message: "Correct Request" });
});

module.exports = app;
