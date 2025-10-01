const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  getCodesBySlug
} = require("../controllers/departmentCode.controller");

// Token gerekli - slug ile ders kodlarını getir
router.get("/:slug/department-codes", authMiddleware, getCodesBySlug);

module.exports = router;
