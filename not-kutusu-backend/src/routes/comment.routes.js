const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  addComment,
  getCommentsForNote,
  likeComment,
  dislikeComment,
  reportComment,
  deleteComment
} = require("../controllers/comment.controller");

// 🟢 Yorum Ekle
router.post("/notes/:noteId/comments", authMiddleware, addComment);

// 🗑️ Yorum Sil
router.delete("/comments/:id", authMiddleware, deleteComment);

// 🟡 Belirli notun tüm yorumlarını getir
router.get("/notes/:noteId/comments", authMiddleware, getCommentsForNote);

// ✅ Etkileşimler (JWT + üniversite kontrolü var)
router.patch("/comments/:id/like", authMiddleware, likeComment);
router.patch("/comments/:id/dislike", authMiddleware, dislikeComment);
router.patch("/comments/:id/report", authMiddleware, reportComment);

module.exports = router;

