const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { generalLimiter } = require("./middleware/rateLimiter");

const app = express();

// Middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));

// 🎯 Sıkı CORS ayarı
const allowedOrigins = [process.env.FRONTEND_URL];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS policy: Bu domain'e izin verilmiyor."));
    }
  },
  credentials: true
}));

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
const { swaggerUi, swaggerSpec } = require("./swagger");
const commentRoutes = require("./routes/comment.routes");
const userRoutes = require("./routes/user.routes");
const departmentCodeRoutes = require("./routes/departmentCode.routes");

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api", courseRoutes);
app.use("/api", noteRoutes);
app.use("/api", universityRoutes);
app.use("/api", commentRoutes);
app.use("/api", userRoutes);
app.use("/api", departmentCodeRoutes);

// Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Test route
app.get("/ping", (req, res) => {
  res.json({ message: "Correct Request" });
});

module.exports = app;
