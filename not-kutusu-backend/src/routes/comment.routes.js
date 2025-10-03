const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { interactionLimiter } = require("../middleware/rateLimiter");
const {
  addComment,
  getCommentsForNote,
  deleteComment
} = require("../controllers/comment.controller");

// 🟢 Yorum Ekle
router.post("/notes/:noteId/comments", authMiddleware, interactionLimiter, addComment);

// 🗑️ Yorum Sil
router.delete("/comments/:id", authMiddleware, deleteComment);

// 🟡 Belirli notun tüm yorumlarını getir
router.get("/notes/:noteId/comments", authMiddleware, getCommentsForNote);

// ⚠️ DEPRECATED: Reaction routes moved to reaction.routes.js
// Old: PATCH /api/comments/:id/like
// New: POST /api/comment/:id/like (via reaction.routes.js)

module.exports = router;

