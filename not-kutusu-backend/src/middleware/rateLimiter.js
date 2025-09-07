const rateLimit = require("express-rate-limit");

// 🛡 Genel rate limiter (örneğin tüm API için)
const generalLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 dakika
  max: 100, // 10 dakikada en fazla 100 istek
  message: { message: "Çok fazla istek yaptınız. Lütfen daha sonra tekrar deneyin." },
});

// 🛡 Auth işlemleri için özel limiter
const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 dakika
  max: 10, // 10 dakikada en fazla 10 deneme
  message: { message: "Çok fazla deneme yaptınız. Lütfen daha sonra tekrar deneyin." },
});

module.exports = { generalLimiter, authLimiter };
