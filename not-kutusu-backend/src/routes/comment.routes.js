const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { interactionLimiter } = require("../middleware/rateLimiter");
const {
  addComment,
  getCommentsForNote,
  likeComment,
  dislikeComment,
  reportComment,
  deleteComment
} = require("../controllers/comment.controller");

// 🟢 Yorum Ekle
router.post("/notes/:noteId/comments", authMiddleware, interactionLimiter, addComment);

// 🗑️ Yorum Sil
router.delete("/comments/:id", authMiddleware, deleteComment);

// 🟡 Belirli notun tüm yorumlarını getir
router.get("/notes/:noteId/comments", authMiddleware, getCommentsForNote);

// ✅ Etkileşimler (JWT + üniversite kontrolü var)
router.patch("/comments/:id/like", authMiddleware, interactionLimiter, likeComment);
router.patch("/comments/:id/dislike", authMiddleware, interactionLimiter, dislikeComment);
router.patch("/comments/:id/report", authMiddleware, interactionLimiter, reportComment);

module.exports = router;

