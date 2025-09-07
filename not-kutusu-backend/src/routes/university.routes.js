const express = require("express");
const router = express.Router();

const { getAllUniversities } = require("../controllers/university.controller");
const authMiddleware = require("../middleware/authMiddleware");


// 🎓 Üniversiteleri listele (herkes erişebilir)
router.get("/universities", authMiddleware, getAllUniversities);

module.exports = router;
