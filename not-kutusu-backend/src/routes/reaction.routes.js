const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { interactionLimiter } = require("../middleware/rateLimiter");
const {
  likeTarget,
  dislikeTarget,
  reportTarget,
  getMyReaction
} = require("../controllers/reaction.controller");

/**
 * Polymorphic Reaction Routes
 * targetType: "notes" | "comments" | "note" | "comment" (hepsi desteklenir)
 *
 * Örnekler:
 * POST /api/notes/:id/like
 * POST /api/note/:id/like
 * POST /api/comments/:id/like
 * POST /api/comment/:id/like
 */

// ✅ Like
router.post("/:targetType/:id/like", authMiddleware, interactionLimiter, likeTarget);

// ❌ Dislike
router.post("/:targetType/:id/dislike", authMiddleware, interactionLimiter, dislikeTarget);

// 🚩 Report
router.post("/:targetType/:id/report", authMiddleware, interactionLimiter, reportTarget);

// 🔍 Kullanıcının reaction durumu
router.get("/:targetType/:id/my-reaction", authMiddleware, getMyReaction);

module.exports = router;
