const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  getUserGamification,
  getUserBadges,
  getUniversityMonthlyLeaderboard,
  getGlobalLeaderboard,
  getUniversityStats
} = require("../controllers/scoreboardGame.controller");

// Tüm endpoint'ler token gerektirir
router.use(authMiddleware);

// 🎮 Kullanıcı Gamification Bilgileri
router.get("/user/:id", getUserGamification);
router.get("/user/:id/badges", getUserBadges);

// 📊 Liderlik Tabloları
router.get("/leaderboard/:slug/monthly", getUniversityMonthlyLeaderboard);
router.get("/leaderboard/global", getGlobalLeaderboard);

// 📈 İstatistikler
router.get("/:slug/stats", getUniversityStats);

module.exports = router;
