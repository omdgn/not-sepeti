// controllers/auth.controller.js
const User = require("../models/user.model");
const University = require("../models/university.model");
const bcrypt = require("bcryptjs");
const extractEmailDomain = require("../utils/emailDomain");
const { generateToken } = require("../utils/jwt");
const { sendVerificationEmail } = require("../utils/email");
const jwt = require("jsonwebtoken");
const { validateAuth, validatePasswordReset, validateEmail } = require("../utils/validateInput");
const { authLogger } = require("../utils/logger");

// Şifre validasyon regex'i (Türkçe karakterler dahil)
const passwordRegex = /^(?=.*[a-zçğıöşü])(?=.*[A-ZÇĞİÖŞÜ])(?=.*\d).{6,}$/;

// 🟢 Kayıt işlemi
const register = async (req, res) => {
  try {
    const { name, email, password, universityId, role, slug } = req.body;

    // Input validation
    const validation = validateAuth(email, password, name);
    if (!validation.valid) {
      return res.status(400).json({ message: validation.message });
    }

    // Şifre karmaşıklığı kontrolü
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message: "Şifre en az 6 karakter olmalı, 1 büyük harf, 1 küçük harf ve 1 rakam içermelidir."
      });
    }

    // Eğer user ise üniversite zorunlu + domain kontrolü + slug zorunlu
    if (role !== "admin") {
      if (!universityId || !slug) {
        return res.status(400).json({ message: "Üniversite ID ve slug zorunludur." });
      }

      const domain = extractEmailDomain(email);
      const university = await University.findOne({ _id: universityId, slug });

      if (!university) {
        return res.status(400).json({ message: "Üniversite bulunamadı veya slug hatalı." });
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
    authLogger.error("Register", err);
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

    // Input validation
    const validation = validateAuth(email, password);
    if (!validation.valid) {
      return res.status(400).json({ message: validation.message });
    }

    // Üniversite slug bilgisini almak için populate kullanıyoruz
    const user = await User.findOne({ email }).populate("universityId", "slug");
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
      universityId: user.universityId?._id,
      role: user.role,
      tokenVersion: user.tokenVersion
    });

    res.status(200).json({
      message: "Giriş başarılı",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        university: user.universityId
          ? { id: user.universityId._id, slug: user.universityId.slug }
          : null
      }
    });
  } catch (err) {
    authLogger.error("Login", err);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};

const { sendResetPasswordEmail } = require("../utils/email");

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Input validation
    const validation = validateEmail(email);
    if (!validation.valid) {
      return res.status(400).json({ message: validation.message });
    }

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
    authLogger.error("ForgotPassword", err);
    return res.status(500).json({ message: "Sunucu hatası" });
  }
};


const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || typeof token !== 'string') {
      return res.status(400).json({ message: "Geçersiz token" });
    }

    // Password validation
    const validation = validatePasswordReset(newPassword);
    if (!validation.valid) {
      return res.status(400).json({ message: validation.message });
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
    user.tokenVersion += 1; // Eski token'ları geçersiz kıl
    await user.save();

    return res.status(200).json({ message: "Şifre başarıyla güncellendi." });
  } catch (err) {
    authLogger.error("ResetPassword", err);
    return res.status(400).json({ message: "Token geçersiz veya süresi dolmuş." });
  }
};


// 🟣 Profil güncelleme
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, profilePic, aboutMe, department, socialLinks, notifications } = req.body;

    // En az bir alan gönderilmeli
    if (!name && !profilePic && aboutMe === undefined && !department && !socialLinks && notifications === undefined) {
      return res.status(400).json({ message: "Güncellenecek en az bir alan belirtmelisiniz" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }

    // İsim validasyonu
    if (name !== undefined) {
      if (!name || name.trim().length < 2 || name.trim().length > 50) {
        return res.status(400).json({ message: "İsim 2-50 karakter arasında olmalıdır" });
      }
      user.name = name.trim();
    }

    // Profil resmi validasyonu
    if (profilePic !== undefined) {
      if (profilePic && (!profilePic.startsWith("http://") && !profilePic.startsWith("https://"))) {
        return res.status(400).json({ message: "Geçerli bir URL giriniz" });
      }
      user.profilePic = profilePic.trim();
    }

    // Hakkımda validasyonu
    if (aboutMe !== undefined) {
      if (aboutMe && aboutMe.trim().length > 500) {
        return res.status(400).json({ message: "Hakkımda 500 karakterden fazla olamaz" });
      }
      user.aboutMe = aboutMe.trim();
    }

    // Bölüm validasyonu
    if (department !== undefined) {
      if (department && department.trim().length > 100) {
        return res.status(400).json({ message: "Bölüm 100 karakterden fazla olamaz" });
      }
      user.department = department.trim();
    }

    // Sosyal linkler validasyonu
    if (socialLinks !== undefined) {
      if (typeof socialLinks !== "object" || Array.isArray(socialLinks)) {
        return res.status(400).json({ message: "Geçersiz sosyal link formatı" });
      }

      if (socialLinks.linkedin !== undefined) {
        if (typeof socialLinks.linkedin !== "string") {
          return res.status(400).json({ message: "LinkedIn URL string olmalıdır" });
        }
        if (socialLinks.linkedin && (!socialLinks.linkedin.startsWith("http://") && !socialLinks.linkedin.startsWith("https://"))) {
          return res.status(400).json({ message: "Geçerli bir LinkedIn URL'i giriniz" });
        }
        user.socialLinks.linkedin = socialLinks.linkedin.trim();
      }
      if (socialLinks.github !== undefined) {
        if (typeof socialLinks.github !== "string") {
          return res.status(400).json({ message: "GitHub URL string olmalıdır" });
        }
        if (socialLinks.github && (!socialLinks.github.startsWith("http://") && !socialLinks.github.startsWith("https://"))) {
          return res.status(400).json({ message: "Geçerli bir GitHub URL'i giriniz" });
        }
        user.socialLinks.github = socialLinks.github.trim();
      }
    }

    // Bildirim tercihi
    if (notifications !== undefined) {
      if (typeof notifications !== "boolean") {
        return res.status(400).json({ message: "Bildirim tercihi true veya false olmalıdır" });
      }
      user.notifications = notifications;
    }

    await user.save();

    res.status(200).json({
      message: "Profil başarıyla güncellendi",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePic: user.profilePic,
        aboutMe: user.aboutMe,
        department: user.department,
        socialLinks: user.socialLinks,
        notifications: user.notifications
      }
    });
  } catch (err) {
    console.error("❌ [UPDATE PROFILE] Hata:", err.message);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};


// 🔑 Profil şifre güncelleme (giriş yapmış kullanıcı için)
const profileResetPassword = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { currentPassword, newPassword } = req.body;

    // Password validation
    const currentValidation = validatePasswordReset(currentPassword);
    if (!currentValidation.valid) {
      return res.status(400).json({ message: "Mevcut şifre geçersiz" });
    }

    const newValidation = validatePasswordReset(newPassword);
    if (!newValidation.valid) {
      return res.status(400).json({ message: newValidation.message });
    }

    // Yeni şifre validasyonu
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        message: "Şifre en az 6 karakter olmalı, 1 büyük harf, 1 küçük harf ve 1 rakam içermelidir"
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }

    // Mevcut şifre kontrolü
    const isPasswordMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Mevcut şifre yanlış" });
    }

    // Yeni şifre eski şifreyle aynı olamaz
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return res.status(400).json({ message: "Yeni şifre eski şifrenizle aynı olamaz" });
    }

    // Şifreyi güncelle
    user.password = await bcrypt.hash(newPassword, 10);
    user.tokenVersion += 1; // Eski token'ları geçersiz kıl
    await user.save();

    return res.status(200).json({ message: "Şifre başarıyla güncellendi" });
  } catch (err) {
    authLogger.error("ProfileResetPassword", err);
    return res.status(500).json({ message: "Sunucu hatası" });
  }
};


// 🟢 Kullanıcının kendi profilini görüntüleme
const myProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId)
      .select("-password -verificationToken -verificationExpires -resetPasswordToken -resetPasswordExpires")
      .populate("universityId", "name slug")
      .lean();

    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }

    // Rozet bilgilerini al
    const { BADGES, LEVELS } = require("../config/badgesConfig");
    const badgeDetails = user.badges.map(badgeId => {
      const badgeKey = Object.keys(BADGES).find(key => BADGES[key].id === badgeId);
      return badgeKey ? {
        id: BADGES[badgeKey].id,
        name: BADGES[badgeKey].name,
        icon: BADGES[badgeKey].icon,
        description: BADGES[badgeKey].description
      } : null;
    }).filter(Boolean);

    // Seviye bilgisini al
    const levelInfo = LEVELS[user.level] || { name: "Acemi" };

    res.status(200).json({
      profile: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePic: user.profilePic,
        department: user.department,
        aboutMe: user.aboutMe,
        socialLinks: user.socialLinks,
        university: user.universityId ? {
          id: user.universityId._id,
          name: user.universityId.name,
          slug: user.universityId.slug
        } : null
      },
      gamification: {
        score: user.score,
        monthlyScore: user.monthlyScore,
        level: {
          number: user.level,
          name: levelInfo.name
        },
        badges: badgeDetails
      },
      stats: {
        totalNotes: user.stats.notes,
        totalLikes: user.stats.likesReceived,
        totalComments: user.stats.comments
      }
    });
  } catch (err) {
    console.error("❌ [MY PROFILE] Hata:", err.message);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};


module.exports = { register, verifyEmail, resendVerificationEmail, login, forgotPassword, resetPassword, updateProfile, profileResetPassword, myProfile };
