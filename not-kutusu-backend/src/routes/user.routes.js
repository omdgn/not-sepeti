const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  getUserProfile,
  updateUserProfile,
  getUserNotes,
  getUserComments
} = require("../controllers/user.controller");

// Kullanıcı profil bilgisi
router.get("/:slug/users/:id", authMiddleware, getUserProfile);

// Profil güncelleme (sadece kendisi)
router.patch("/:slug/users/:id", authMiddleware, updateUserProfile);

// Kullanıcının notları
router.get("/:slug/users/:id/notes", authMiddleware, getUserNotes);

// Kullanıcının yorumları
router.get("/:slug/users/:id/comments", authMiddleware, getUserComments);

module.exports = router;
