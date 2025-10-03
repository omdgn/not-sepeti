const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  uploadNote,
  getNoteById,
  getNotesByCourseSlug,
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

// ⚠️ DEPRECATED: Reaction routes moved to reaction.routes.js
// Old: PATCH /api/notes/:id/like
// New: POST /api/note/:id/like (via reaction.routes.js)

router.get("/:slug/top-contributors", authMiddleware, getTopContributors);
router.get("/:slug/top-notes", authMiddleware, getTopNotes);
router.get("/:slug/notes/search", authMiddleware, searchNotes);
router.get("/:slug/search-bar", authMiddleware, searchNotesWithSearchBar);
router.get("/:slug/notes/latest", authMiddleware, getLatestNotes);



module.exports = router;
