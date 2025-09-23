const express = require("express");
const router = express.Router();

const { getAllUniversities, getGlobalStats, getUniversityStats } = require("../controllers/university.controller");
const authMiddleware = require("../middleware/authMiddleware");


// 🎓 Üniversiteleri listele (herkes erişebilir)
router.get("/universities", getAllUniversities);

// 📊 Global istatistikler (herkes erişebilir)
router.get("/universities/stats", getGlobalStats);

// 📊 Üniversiteye özgü istatistikler (slug bazlı, giriş gerekli)
router.get("/universities/:slug/stats", authMiddleware, getUniversityStats);

module.exports = router;
