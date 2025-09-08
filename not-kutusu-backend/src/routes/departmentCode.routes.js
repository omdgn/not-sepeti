const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/isAdmin");
const {
  getCodesBySlug,
  getMyUniversityCodes,
  addDepartmentCode,
  getAllDepartmentCodes,
  updateDepartmentCode,
  deleteDepartmentCode
} = require("../controllers/departmentCode.controller");

// Herkes erişebilir (slug ile – token gerekmez)
router.get("/:slug/department-codes", getCodesBySlug);

// Giriş yapmış kullanıcı
router.get("/department-codes/my-university", authMiddleware, getMyUniversityCodes);
router.post("/department-codes", authMiddleware, addDepartmentCode);

// Admin route'ları
router.get("/admin/department-codes", authMiddleware, isAdmin, getAllDepartmentCodes);
router.patch("/admin/department-codes/:id", authMiddleware, isAdmin, updateDepartmentCode);
router.delete("/admin/department-codes/:id", authMiddleware, isAdmin, deleteDepartmentCode);

module.exports = router;
