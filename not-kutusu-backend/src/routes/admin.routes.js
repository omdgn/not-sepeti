const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
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
  adminSearchNotesWithSearchBar
} = require("../controllers/admin.controller");

// 📌 Bu route dışındaki her şey token ister!
router.post("/login", adminLogin); // -> /api/admin/login

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
router.patch("/users/:id/ban", banUser);
router.patch("/users/:id/unban", unbanUser);

// Öneri yönetimi
router.get("/suggestions", getAllSuggestions);
router.put("/suggestions/:id/status", updateSuggestionStatus);
router.delete("/suggestions/:id", deleteSuggestionByAdmin);

// Arama
router.get("/search-bar", adminSearchNotesWithSearchBar);

module.exports = router;
