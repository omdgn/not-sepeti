const express = require("express");
const router = express.Router();
const {
  createSuggestion,
  getMySuggestions,
  getSuggestionById,
  updateSuggestion,
  deleteSuggestion
} = require("../controllers/suggestion.controller");
const authMiddleware = require("../middleware/authMiddleware");

// Kullanıcı öneri endpoints (authentication gerekli)
router.post("/suggestions", authMiddleware, createSuggestion);
router.get("/suggestions/my", authMiddleware, getMySuggestions);
router.get("/suggestions/:id", authMiddleware, getSuggestionById);
router.put("/suggestions/:id", authMiddleware, updateSuggestion);
router.delete("/suggestions/:id", authMiddleware, deleteSuggestion);

module.exports = router;