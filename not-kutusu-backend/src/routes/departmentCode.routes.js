const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  getCodesBySlug,
  getMyUniversityCodes
} = require("../controllers/departmentCode.controller");

// Herkes erişebilir (slug ile – token gerekmez)
router.get("/:slug/department-codes", getCodesBySlug);

// Giriş yapmış kullanıcı
router.get("/department-codes/my-university", authMiddleware, getMyUniversityCodes);

module.exports = router;
