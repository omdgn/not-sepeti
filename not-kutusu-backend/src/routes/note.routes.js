const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { interactionLimiter } = require("../middleware/rateLimiter");
const {
  uploadNote,
  getNoteById,
  getNotesByCourseSlug,
  likeNote,
  dislikeNote,
  reportNote,
  getTopContributors,
  getTopNotes,
  searchNotes,
  searchNotesWithSearchBar,
  getLatestNotes,
  updateNote,
  deleteNote
} = require("../controllers/note.controller");

router.post("/notes", authMiddleware, uploadNote);
router.get("/notes/:id", authMiddleware, getNoteById);
router.patch("/notes/:id", authMiddleware, updateNote);
router.delete("/notes/:id", authMiddleware, deleteNote);
router.get("/:slug/notes", authMiddleware, getNotesByCourseSlug);
router.get("/:slug/courses/:courseId/notes", authMiddleware, getNotesByCourseSlug);
router.patch("/notes/:id/like", authMiddleware, interactionLimiter, likeNote);
router.patch("/notes/:id/dislike", authMiddleware, interactionLimiter, dislikeNote);
router.patch("/notes/:id/report", authMiddleware, interactionLimiter, reportNote);
router.get("/:slug/top-contributors", authMiddleware, getTopContributors);
router.get("/:slug/top-notes", authMiddleware, getTopNotes);
router.get("/:slug/notes/search", authMiddleware, searchNotes);
router.get("/:slug/search-bar", authMiddleware, searchNotesWithSearchBar);
router.get("/:slug/notes/latest", authMiddleware, getLatestNotes);



module.exports = router;
