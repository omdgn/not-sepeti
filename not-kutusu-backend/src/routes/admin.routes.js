const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { adminLoginLimiter } = require("../middleware/rateLimiter");
const {
  getReportedNotes,
  getInactiveNotes,
  activateNote,
  getReportedComments,
  deleteNoteByAdmin,
  deleteCommentByAdmin,
  banUser,
  unbanUser,
  createUniversity,
  updateUniversity,
  deleteUniversity,
  adminLogin,
  getAllSuggestions,
  updateSuggestionStatus,
  deleteSuggestionByAdmin,
  adminSearchNotesWithSearchBar,
  getAllUsers,
  getUserById,
  updateUserStatus
} = require("../controllers/admin.controller");

const { createCourse } = require("../controllers/course.controller");
const {
  addDepartmentCode,
  getAllDepartmentCodes,
  updateDepartmentCode,
  deleteDepartmentCode
} = require("../controllers/departmentCode.controller");

// 📌 Bu route dışındaki her şey token ister!
router.post("/login", adminLoginLimiter, adminLogin); // -> /api/admin/login

// 🔐 Tüm diğer admin endpoint'leri için token kontrolü
router.use(authMiddleware);

// Üniversite ekleme, güncelleme, silme
router.post("/universities", createUniversity);
router.put("/universities/:id", updateUniversity);
router.delete("/universities/:id", deleteUniversity);

// Raporlanan içerikler
router.get("/notes/reported", getReportedNotes);
router.get("/notes/inactive", getInactiveNotes);
router.patch("/notes/:id/activate", activateNote);
router.get("/comments/reported", getReportedComments);

// İçerik silme
router.delete("/notes/:id", deleteNoteByAdmin);
router.delete("/comments/:id", deleteCommentByAdmin);

// Kullanıcı yönetimi
router.get("/users", getAllUsers); // 🆕 Kullanıcı listesi
router.get("/users/:id", getUserById); // 🆕 Kullanıcı detayları
router.patch("/users/:id/status", updateUserStatus); // 🆕 Kullanıcı durumu güncelle
router.patch("/users/:id/ban", banUser); // Backward compatibility
router.patch("/users/:id/unban", unbanUser); // Backward compatibility

// Öneri yönetimi
router.get("/suggestions", getAllSuggestions);
router.put("/suggestions/:id/status", updateSuggestionStatus);
router.delete("/suggestions/:id", deleteSuggestionByAdmin);

// Arama
router.get("/search-bar", adminSearchNotesWithSearchBar);

// Ders ve Bölüm Kodu Yönetimi (sadece admin)
router.post("/courses", createCourse);
router.post("/department-codes", addDepartmentCode);
router.get("/department-codes", getAllDepartmentCodes);
router.patch("/department-codes/:id", updateDepartmentCode);
router.delete("/department-codes/:id", deleteDepartmentCode);

module.exports = router;
