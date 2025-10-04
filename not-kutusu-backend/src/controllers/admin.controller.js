const Note = require("../models/note.model");
const Comment = require("../models/comment.model");
const User = require("../models/user.model");
const University = require("../models/university.model");
const UserSuggestion = require("../models/userSuggestion.model");
const gamificationService = require("../services/gamificationService");

const bcrypt = require("bcryptjs");
const { generateToken } = require("../utils/jwt");

// 🔒 Regex escape helper - ReDoS koruması
const escapeRegex = (str) => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

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
      role: user.role,
      tokenVersion: user.tokenVersion
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

    const limit = parseInt(req.query.limit) || 50;

    const notes = await Note.find({ reports: { $gt: 0 } })
      .populate("createdBy", "name email")
      .populate("courseId", "code name")
      .populate("universityId", "name slug")
      .sort({ reports: -1, createdAt: -1 })
      .limit(limit);

    res.json({ notes });
  } catch (err) {
    console.error("Raporlanan notları listeleme hatası:", err);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};

// 🚫 Pasifleştirilmiş Notları Listele (isActive: false)
const getInactiveNotes = async (req, res) => {
  try {
    const notAdmin = checkAdmin(req, res);
    if (notAdmin) return notAdmin;

    const limit = parseInt(req.query.limit) || 50;

    const notes = await Note.find({ isActive: false })
      .populate("createdBy", "name email")
      .populate("courseId", "code name")
      .populate("universityId", "name slug")
      .sort({ reports: -1, createdAt: -1 })
      .limit(limit);

    res.json({ notes });
  } catch (err) {
    console.error("Pasif notları listeleme hatası:", err);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};

// ✅ Notu Yeniden Aktifleştir
const activateNote = async (req, res) => {
  try {
    const notAdmin = checkAdmin(req, res);
    if (notAdmin) return notAdmin;

    const note = await Note.findByIdAndUpdate(
      req.params.id,
      { isActive: true, reports: 0 },
      { new: true }
    )
      .populate("createdBy", "name email")
      .populate("courseId", "code name");

    if (!note) return res.status(404).json({ message: "Not bulunamadı" });

    // Course noteCount'u artır (restore edildiği için)
    const Course = require("../models/course.model");
    await Course.findByIdAndUpdate(note.courseId._id, { $inc: { noteCount: 1 } });

    res.json({ message: "Not aktifleştirildi ve raporlar sıfırlandı", note });
  } catch (err) {
    console.error("Not aktifleştirme hatası:", err);
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

    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Not bulunamadı" });

    const noteOwnerId = note.createdBy.toString();
    const courseId = note.courseId;

    await Note.findByIdAndDelete(req.params.id);

    // 🎮 Gamification: Not silme puanı
    await gamificationService.onNoteDelete(noteOwnerId);

    // Course noteCount'u azalt (kalıcı silindiği için)
    const Course = require("../models/course.model");
    await Course.findByIdAndUpdate(courseId, { $inc: { noteCount: -1 } });

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

    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: "Yorum bulunamadı" });

    const commentOwnerId = comment.userId.toString();

    await Comment.findByIdAndDelete(req.params.id);

    // 🎮 Gamification: Yorum silme puanı
    await gamificationService.onCommentDelete(commentOwnerId);

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

// 🟡 Admin - Tüm önerileri getirme
const getAllSuggestions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const status = req.query.status;
    const search = req.query.search;

    let query = {};

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    const suggestions = await UserSuggestion.find(query)
      .populate('userId', 'name email')
      .populate('adminId', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await UserSuggestion.countDocuments(query);

    res.json({
      success: true,
      data: suggestions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error("Admin öneri listesi hatası:", error);
    res.status(500).json({
      success: false,
      message: "Sunucu hatası"
    });
  }
};

// 🟡 Admin - Öneri durumu güncelleme
const updateSuggestionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;
    const adminId = req.user._id || req.user.userId;

    const validStatuses = ["Beklemede", "Görüldü", "İnceleniyor", "Eklendi", "Eklenmedi"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Geçersiz durum değeri."
      });
    }

    const suggestion = await UserSuggestion.findById(id);

    if (!suggestion) {
      return res.status(404).json({
        success: false,
        message: "Öneri bulunamadı."
      });
    }

    suggestion.status = status;
    suggestion.adminId = adminId;

    if (adminNotes) {
      suggestion.adminNotes = adminNotes;
    }

    await suggestion.save();
    await suggestion.populate('userId', 'name email');
    await suggestion.populate('adminId', 'name email');

    res.json({
      success: true,
      message: "Öneri durumu başarıyla güncellendi.",
      data: suggestion
    });

  } catch (error) {
    console.error("Admin öneri güncelleme hatası:", error);
    res.status(500).json({
      success: false,
      message: "Sunucu hatası"
    });
  }
};

// 🟡 Admin - Öneri silme
const deleteSuggestionByAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const suggestion = await UserSuggestion.findById(id);

    if (!suggestion) {
      return res.status(404).json({
        success: false,
        message: "Öneri bulunamadı."
      });
    }

    await UserSuggestion.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Öneri başarıyla silindi."
    });

  } catch (error) {
    console.error("Admin öneri silme hatası:", error);
    res.status(500).json({
      success: false,
      message: "Sunucu hatası"
    });
  }
};

// 🔎 Admin - Search Bar ile Not Arama (Pagination)
const adminSearchNotesWithSearchBar = async (req, res) => {
  try {
    const notAdmin = checkAdmin(req, res);
    if (notAdmin) return notAdmin;

    const { q, page = 1, limit = 15, universitySlug } = req.query;

    if (!q || q.trim() === "") {
      return res.status(400).json({ message: "Arama terimi gerekli." });
    }

    const regex = new RegExp(escapeRegex(q), "i");
    const Course = require("../models/course.model");

    let filter = {};

    // Eğer üniversite slug'ı verilmişse, sadece o üniversiteye ait notları getir
    if (universitySlug) {
      const university = await University.findOne({ slug: universitySlug });
      if (!university) {
        return res.status(404).json({ message: "Üniversite bulunamadı." });
      }
      filter.universityId = university._id;
    }

    // Course code eşleşmeleri
    const courseQuery = { code: regex };
    if (filter.universityId) {
      courseQuery.universityId = filter.universityId;
    }

    const matchedCourses = await Course.find(courseQuery).select("_id");
    const matchedCourseIds = matchedCourses.map(c => c._id);

    // Pagination hesaplamaları
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Arama query'si
    const searchQuery = {
      ...filter,
      $or: [
        { title: regex },
        { description: regex },
        { courseId: { $in: matchedCourseIds } }
      ]
    };

    // Toplam sonuç sayısı
    const totalResults = await Note.countDocuments(searchQuery);

    // Notları getir
    const notes = await Note.find(searchQuery)
      .populate("courseId", "code name")
      .populate("createdBy", "name email")
      .populate("universityId", "name slug")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const totalPages = Math.ceil(totalResults / limitNum);

    res.status(200).json({
      notes,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalResults,
        resultsPerPage: limitNum,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1
      }
    });
  } catch (err) {
    console.error("Admin search bar arama hatası:", err);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};

// 👥 Kullanıcı Listesi (Admin)
const getAllUsers = async (req, res) => {
  try {
    const notAdmin = checkAdmin(req, res);
    if (notAdmin) return notAdmin;

    const { page = 1, limit = 20, search, status, universityId } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    let filter = {};

    // Arama filtresi (isim veya email)
    if (search) {
      const regex = new RegExp(escapeRegex(search), "i");
      filter.$or = [
        { name: regex },
        { email: regex }
      ];
    }

    // Status filtresi (active/inactive)
    if (status === "active") {
      filter.isActive = true;
    } else if (status === "inactive") {
      filter.isActive = false;
    }

    // Üniversite filtresi
    if (universityId) {
      filter.universityId = universityId;
    }

    // Admin'leri listeden çıkar (opsiyonel)
    filter.role = { $ne: "admin" };

    const users = await User.find(filter)
      .populate("universityId", "name slug")
      .select("-password -verificationToken -verificationExpires -resetPasswordToken -resetPasswordExpires")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await User.countDocuments(filter);

    res.status(200).json({
      users,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalUsers: total,
        usersPerPage: parseInt(limit)
      }
    });
  } catch (err) {
    console.error("❌ [GET ALL USERS] Hata:", err.message);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};

// 👤 Kullanıcı Detayları (Admin)
const getUserById = async (req, res) => {
  try {
    const notAdmin = checkAdmin(req, res);
    if (notAdmin) return notAdmin;

    const { id } = req.params;

    const user = await User.findById(id)
      .populate("universityId", "name slug")
      .select("-password -verificationToken -verificationExpires -resetPasswordToken -resetPasswordExpires")
      .lean();

    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }

    // Kullanıcının notları
    const notes = await Note.find({ createdBy: id, isActive: true })
      .populate("courseId", "code name")
      .select("title createdAt likes dislikes reports")
      .sort({ createdAt: -1 })
      .limit(10);

    // Kullanıcının yorumları
    const comments = await Comment.find({ userId: id })
      .populate("noteId", "title")
      .select("text createdAt likes dislikes reports")
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      user,
      recentNotes: notes,
      recentComments: comments
    });
  } catch (err) {
    console.error("❌ [GET USER BY ID] Hata:", err.message);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};

// 🔄 Kullanıcı Durumunu Güncelle (Admin)
const updateUserStatus = async (req, res) => {
  try {
    const notAdmin = checkAdmin(req, res);
    if (notAdmin) return notAdmin;

    const { id } = req.params;
    const { isActive } = req.body;

    if (typeof isActive !== "boolean") {
      return res.status(400).json({ message: "isActive boolean değer olmalıdır" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }

    // Admin'in kendisini banlamaması için kontrol
    if (user.role === "admin") {
      return res.status(403).json({ message: "Admin kullanıcılar banlanamaz" });
    }

    user.isActive = isActive;
    await user.save();

    res.status(200).json({
      message: isActive ? "Kullanıcı aktifleştirildi" : "Kullanıcı pasifleştirildi",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isActive: user.isActive
      }
    });
  } catch (err) {
    console.error("❌ [UPDATE USER STATUS] Hata:", err.message);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};


module.exports = {
  getReportedNotes,
  getInactiveNotes,
  activateNote,
  getReportedComments,
  deleteNoteByAdmin,
  deleteCommentByAdmin,
  banUser,
  unbanUser,
  createUniversity,
  updateUniversity,
  deleteUniversity,
  adminLogin,
  getAllSuggestions,
  updateSuggestionStatus,
  deleteSuggestionByAdmin,
  adminSearchNotesWithSearchBar,
  getAllUsers,
  getUserById,
  updateUserStatus
};
