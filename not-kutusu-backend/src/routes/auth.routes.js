const express = require("express");
const router = express.Router();
const {
  register,
  login,
  verifyEmail,
  resendVerificationEmail,
  forgotPassword,
  resetPassword,
  updateProfile,
  myProfile
} = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/authMiddleware");
const {
  loginLimiter,
  registerLimiter,
  emailResendLimiter,
  passwordResetLimiter
} = require("../middleware/rateLimiter");


router.post("/register", registerLimiter, register);
router.post("/login", loginLimiter, login);
router.get("/verify-email", verifyEmail); // query param ile token
router.post("/resend-verification-email", emailResendLimiter, resendVerificationEmail); // body: email
router.post("/forgot-password", passwordResetLimiter, forgotPassword); // body: email
router.post("/reset-password", passwordResetLimiter, resetPassword);   // body: token + newPassword
router.get("/myProfile", authMiddleware, myProfile); // 🆕 Kendi profilini görüntüleme
router.patch("/profile", authMiddleware, updateProfile); // 🆕 Profil güncelleme

module.exports = router;
