const Note = require("../models/note.model");
const Comment = require("../models/comment.model");
const User = require("../models/user.model");
const University = require("../models/university.model");

const bcrypt = require("bcryptjs");
const { generateToken } = require("../utils/jwt"); 


// 🔒 Admin kontrolü
const checkAdmin = (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Yalnızca admin erişebilir" });
  }
  return null;
};

// 🔐 Admin Girişi
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "E-posta ve şifre zorunludur." });
    }

    const user = await User.findOne({ email });
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Yalnızca admin kullanıcılar bu alana erişebilir." });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Şifre yanlış." });
    }

    // Giriş tarihi güncelle
    user.lastLogin = new Date();
    await user.save();

    const token = generateToken({
      userId: user._id,
      role: user.role
    });

    res.status(200).json({
      message: "Admin girişi başarılı",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error("❌ [ADMIN LOGIN] Hata:", err.message);
    res.status(500).json({ message: "Sunucu hatası" });
  }

};


// Üniversite ekle (Admin)
const createUniversity = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Yalnızca admin erişebilir" });
    }

    const { name, slug, emailDomains } = req.body;
    if (!name || !slug || !emailDomains || !Array.isArray(emailDomains)) {
      return res.status(400).json({ message: "Tüm alanlar zorunludur." });
    }

    const existing = await University.findOne({ slug });
    if (existing) {
      return res.status(400).json({ message: "Slug zaten mevcut." });
    }

    const university = await University.create({ name, slug, emailDomains });
    res.status(201).json({ message: "Üniversite eklendi", university });
  } catch (err) {
    res.status(500).json({ message: "Sunucu hatası", error: err.message });
  }
};

// Üniversite güncelle (Admin)
const updateUniversity = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Yalnızca admin erişebilir" });
    }

    const { id } = req.params;
    const { name, slug, emailDomains } = req.body;

    const university = await University.findByIdAndUpdate(
      id,
      { name, slug, emailDomains },
      { new: true, runValidators: true }
    );

    if (!university) {
      return res.status(404).json({ message: "Üniversite bulunamadı." });
    }

    res.status(200).json({ message: "Üniversite güncellendi", university });
  } catch (err) {
    res.status(500).json({ message: "Sunucu hatası", error: err.message });
  }
};

// Üniversite sil (Admin)
const deleteUniversity = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Yalnızca admin erişebilir" });
    }

    const { id } = req.params;
    const university = await University.findByIdAndDelete(id);

    if (!university) {
      return res.status(404).json({ message: "Üniversite bulunamadı." });
    }

    res.status(200).json({ message: "Üniversite silindi" });
  } catch (err) {
    res.status(500).json({ message: "Sunucu hatası", error: err.message });
  }
};


// 📝 Raporlanan Notları Listele
const getReportedNotes = async (req, res) => {
  try {
    const notAdmin = checkAdmin(req, res);
    if (notAdmin) return notAdmin;

    const notes = await Note.find({ reports: { $gt: 0 } })
      .populate("createdBy", "name email")
      .populate("courseId", "code name")
      .sort({ reports: -1, createdAt: -1 });

    res.json({ notes });
  } catch (err) {
    console.error("Raporlanan notları listeleme hatası:", err);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};

// 💬 Raporlanan Yorumları Listele
const getReportedComments = async (req, res) => {
  try {
    const notAdmin = checkAdmin(req, res);
    if (notAdmin) return notAdmin;

    const comments = await Comment.find({ reports: { $gt: 0 } })
      .populate("userId", "name email")
      .populate("noteId", "title")
      .sort({ reports: -1, createdAt: -1 });

    res.json({ comments });
  } catch (err) {
    console.error("Raporlanan yorumları listeleme hatası:", err);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};

// 🗑️ Not Sil (Admin)
const deleteNoteByAdmin = async (req, res) => {
  try {
    const notAdmin = checkAdmin(req, res);
    if (notAdmin) return notAdmin;

    const note = await Note.findByIdAndDelete(req.params.id);
    if (!note) return res.status(404).json({ message: "Not bulunamadı" });

    res.json({ message: "Not admin tarafından silindi" });
  } catch (err) {
    console.error("Not silme hatası:", err);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};

// 🗑️ Yorum Sil (Admin)
const deleteCommentByAdmin = async (req, res) => {
  try {
    const notAdmin = checkAdmin(req, res);
    if (notAdmin) return notAdmin;

    const comment = await Comment.findByIdAndDelete(req.params.id);
    if (!comment) return res.status(404).json({ message: "Yorum bulunamadı" });

    res.json({ message: "Yorum admin tarafından silindi" });
  } catch (err) {
    console.error("Yorum silme hatası:", err);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};

// 🚫 Kullanıcı Banla
const banUser = async (req, res) => {
  try {
    const notAdmin = checkAdmin(req, res);
    if (notAdmin) return notAdmin;

    const user = await User.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!user) return res.status(404).json({ message: "Kullanıcı bulunamadı" });

    res.json({ message: "Kullanıcı banlandı", user });
  } catch (err) {
    console.error("Kullanıcı banlama hatası:", err);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};

// ✅ Kullanıcı Banını Kaldır
const unbanUser = async (req, res) => {
  try {
    const notAdmin = checkAdmin(req, res);
    if (notAdmin) return notAdmin;

    const user = await User.findByIdAndUpdate(req.params.id, { isActive: true }, { new: true });
    if (!user) return res.status(404).json({ message: "Kullanıcı bulunamadı" });

    res.json({ message: "Kullanıcı banı kaldırıldı", user });
  } catch (err) {
    console.error("Kullanıcı ban kaldırma hatası:", err);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};

module.exports = {
  getReportedNotes,
  getReportedComments,
  deleteNoteByAdmin,
  deleteCommentByAdmin,
  banUser,
  unbanUser,
    createUniversity,
    updateUniversity,
    deleteUniversity,
    adminLogin
};
