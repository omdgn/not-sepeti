// controllers/auth.controller.js
const User = require("../models/user.model");
const University = require("../models/university.model");
const bcrypt = require("bcryptjs");
const extractEmailDomain = require("../utils/emailDomain");
const { generateToken } = require("../utils/jwt");
const { sendVerificationEmail } = require("../utils/email");
const jwt = require("jsonwebtoken");

// Şifre validasyon regex'i
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;

// 🟢 Kayıt işlemi
const register = async (req, res) => {
  try {
    const { name, email, password, universityId, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "İsim, e-posta ve şifre zorunludur." });
    }

    // Şifre kurallarını kontrol et
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Şifre en az 6 karakter olmalı, 1 büyük harf, 1 küçük harf ve 1 rakam içermelidir."
      });
    }

    // Eğer user ise üniversite zorunlu + domain kontrolü
    if (role !== "admin") {
      if (!universityId) {
        return res.status(400).json({ message: "Üniversite ID zorunludur." });
      }

      const domain = extractEmailDomain(email);
      const university = await University.findById(universityId);
      if (!university) {
        return res.status(400).json({ message: "Üniversite bulunamadı." });
      }

      const normalizedDomains = university.emailDomains.map((d) =>
        d.trim().toLowerCase()
      );
      if (!normalizedDomains.includes(domain)) {
        return res
          .status(400)
          .json({ message: "E-posta adresi bu üniversiteye ait değil." });
      }
    }

    // Aynı email kontrolü
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Bu e-posta ile kayıtlı bir kullanıcı zaten var." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Yeni kullanıcı (isVerified default: false)
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      universityId: role !== "admin" ? universityId : undefined,
      role: role || "user",
      isVerified: role === "admin" ? true : false  // admin için direkt verified
    });

    // Doğrulama tokeni üret (24 saat geçerli)
    const verificationToken = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    newUser.verificationToken = verificationToken;
    newUser.verificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 saat
    await newUser.save();

    // Doğrulama e-postası gönder
    await sendVerificationEmail(newUser.email, verificationToken);

    res.status(201).json({
      message: "Kayıt başarılı! Lütfen e-postanızı doğrulayın. (Spam kutusunu da kontrol edin.)"
    });
  } catch (err) {
    console.error("❌ [REGISTER] Hata:", err.message);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};

// 🟡 E-posta doğrulama
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) return res.status(400).json({ message: "Token gerekli." });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) return res.status(400).json({ message: "Kullanıcı bulunamadı." });
    if (user.isVerified) return res.status(400).json({ message: "Hesap zaten doğrulandı." });

    if (user.verificationToken !== token || Date.now() > user.verificationExpires) {
      return res.status(400).json({ message: "Token geçersiz veya süresi dolmuş." });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationExpires = undefined;
    await user.save();

    res.status(200).json({ message: "E-posta başarıyla doğrulandı." });
  } catch (err) {
    console.error("❌ [VERIFY EMAIL] Hata:", err.message);
    res.status(400).json({ message: "Token geçersiz veya süresi dolmuş." });
  }
};


// E-posta doğrulama tokeni süresi dolduğunda yeni token gönderme
const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "E-posta gerekli." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı." });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "Hesap zaten doğrulanmış." });
    }

    // Yeni token oluştur
    const verificationToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    user.verificationToken = verificationToken;
    user.verificationExpires = Date.now() + 15 * 60 * 1000; // 15 dakika
    await user.save();

    await sendVerificationEmail(user.email, verificationToken);

    res.status(200).json({ message: "Doğrulama e-postası tekrar gönderildi." });
  } catch (err) {
    console.error("❌ [RESEND VERIFY] Hata:", err.message);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};


// 🔵 Giriş işlemi
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "E-posta ve şifre zorunludur." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Kullanıcı bulunamadı." });
    }

    // Kullanıcı pasif mi?
    if (user.isActive === false) {
      return res.status(403).json({ message: "Hesabınız pasif durumdadır." });
    }

    // E-posta doğrulanmamışsa login engelle (sadece user için)
    if (user.role !== "admin" && !user.isVerified) {
      return res.status(403).json({ message: "Lütfen önce e-posta adresinizi doğrulayın." });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Şifre yanlış." });
    }

    // Son giriş tarihini güncelle
    user.lastLogin = new Date();
    await user.save();

    const token = generateToken({
      userId: user._id,
      universityId: user.universityId,
      role: user.role
    });

    res.status(200).json({
      message: "Giriş başarılı",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        universityId: user.universityId,
        role: user.role
      }
    });
  } catch (err) {
    console.error("❌ [LOGIN] Hata:", err.message);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};

const { sendResetPasswordEmail } = require("../utils/email");

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "E-posta gereklidir." });

    const user = await User.findOne({ email });
    if (!user || user.role === "admin") {
      // Güvenlik için kullanıcı yoksa da aynı cevabı döneriz
      return res.status(200).json({ message: "Eğer hesap varsa sıfırlama maili gönderildi." });
    }

    const resetToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 saat geçerli
    await user.save();

    await sendResetPasswordEmail(user.email, resetToken);

    return res.status(200).json({
      message: "Eğer hesap varsa sıfırlama maili gönderildi."
    });
  } catch (err) {
    console.error("❌ [FORGOT PASSWORD] Hata:", err.message);
    return res.status(500).json({ message: "Sunucu hatası" });
  }
};


const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: "Token ve yeni şifre zorunludur." });
    }

    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        message: "Şifre en az 6 karakter olmalı, 1 büyük harf, 1 küçük harf ve 1 rakam içermelidir."
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user || user.resetPasswordToken !== token || Date.now() > user.resetPasswordExpires) {
      return res.status(400).json({ message: "Token geçersiz veya süresi dolmuş." });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return res.status(200).json({ message: "Şifre başarıyla güncellendi." });
  } catch (err) {
    console.error("❌ [RESET PASSWORD] Hata:", err.message);
    return res.status(400).json({ message: "Token geçersiz veya süresi dolmuş." });
  }
};


module.exports = { register, verifyEmail, resendVerificationEmail, login, forgotPassword, resetPassword };
