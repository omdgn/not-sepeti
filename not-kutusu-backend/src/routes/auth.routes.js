const express = require("express");
const router = express.Router();
const {
  register,
  login,
  verifyEmail,
  resendVerificationEmail,
  forgotPassword,
  resetPassword
} = require("../controllers/auth.controller");


router.post("/register", register);
router.post("/login", login);
router.get("/verify-email", verifyEmail); // query param ile token
router.post("/resend-verification-email", resendVerificationEmail); // body: email
router.post("/forgot-password", forgotPassword); // body: email
router.post("/reset-password", resetPassword);   // body: token + newPassword

module.exports = router;
