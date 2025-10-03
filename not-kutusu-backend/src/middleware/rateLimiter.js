const rateLimit = require("express-rate-limit");

// 🔐 Login rate limiter - Brute force koruması
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakika
  max: 5, // 5 deneme
  message: { message: "Çok fazla giriş denemesi yapıldı. Lütfen 15 dakika sonra tekrar deneyin." },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true // Başarılı login'ler sayılmaz
});

// 🔐 Register rate limiter - Spam kayıt koruması
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 saat
  max: 3, // 3 kayıt
  message: { message: "Çok fazla kayıt denemesi yapıldı. Lütfen 1 saat sonra tekrar deneyin." },
  standardHeaders: true,
  legacyHeaders: false
});

// 🔐 Like/Comment rate limiter - Spam koruması
const interactionLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 dakika
  max: 20, // 20 işlem (like/dislike/comment)
  message: { message: "Çok fazla işlem yapıldı. Lütfen bir dakika bekleyin." },
  standardHeaders: true,
  legacyHeaders: false
});

// 🔐 Email verification resend limiter
const emailResendLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 dakika
  max: 3, // 3 deneme
  message: { message: "Çok fazla doğrulama maili isteği. Lütfen 5 dakika bekleyin." },
  standardHeaders: true,
  legacyHeaders: false
});

// 🔐 Password reset limiter
const passwordResetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakika
  max: 3, // 3 deneme
  message: { message: "Çok fazla şifre sıfırlama isteği. Lütfen 15 dakika bekleyin." },
  standardHeaders: true,
  legacyHeaders: false
});

// 🔐 Profile password change limiter
const profilePasswordChangeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakika
  max: 3, // 3 deneme
  message: { message: "Çok fazla şifre değiştirme isteği. Lütfen 15 dakika bekleyin." },
  standardHeaders: true,
  legacyHeaders: false
});

// 🔐 General API limiter - Genel koruma
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakika
  max: 100, // 100 istek
  message: { message: "Çok fazla istek gönderildi. Lütfen 15 dakika bekleyin." },
  standardHeaders: true,
  legacyHeaders: false
});

// 🛡 Auth işlemleri için özel limiter (backward compatibility)
const authLimiter = loginLimiter;

module.exports = {
  loginLimiter,
  registerLimiter,
  interactionLimiter,
  emailResendLimiter,
  passwordResetLimiter,
  profilePasswordChangeLimiter,
  generalLimiter,
  authLimiter // backward compatibility
};
