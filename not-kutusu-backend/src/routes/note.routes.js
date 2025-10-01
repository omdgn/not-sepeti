const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  uploadNote,
  getNotes,
  getNoteById,
  getNotesByCourseSlug,
  likeNote,
  dislikeNote,
  reportNote,
  getTopContributors,
  getTopNotes,
  searchNotes,
  searchNotesWithSearchBar
} = require("../controllers/note.controller");

router.post("/notes", authMiddleware, uploadNote);
router.get("/notes", authMiddleware, getNotes);
router.get("/notes/:id", authMiddleware, getNoteById);
router.get("/:slug/courses/:courseId/notes", authMiddleware, getNotesByCourseSlug);
router.patch("/notes/:id/like", authMiddleware, likeNote);
router.patch("/notes/:id/dislike", authMiddleware, dislikeNote);
router.patch("/notes/:id/report", authMiddleware, reportNote);
router.get("/:slug/top-contributors", authMiddleware, getTopContributors);
router.get("/:slug/top-notes", authMiddleware, getTopNotes);
router.get("/:slug/notes/search", authMiddleware, searchNotes);
router.get("/:slug/search-bar", authMiddleware, searchNotesWithSearchBar);



module.exports = router;
