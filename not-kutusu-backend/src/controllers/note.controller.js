const axios = require("axios");
const Note = require("../models/note.model");
const University = require("../models/university.model");
const Course = require("../models/course.model");
const User = require("../models/user.model");

// 🔒 URL doğrulama helper
const isValidURL = (url) => {
  try {
    const parsed = new URL(url);
    const blockedHosts = ["localhost", "127.0.0.1", "0.0.0.0"];
    if (!["http:", "https:"].includes(parsed.protocol)) return false;
    if (blockedHosts.includes(parsed.hostname)) return false;
    return true;
  } catch {
    return false;
  }
};

// 🔒 Dosya kontrol helper
const checkFileAccessible = async (url) => {
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname;

    if (hostname.includes("drive.google.com") && url.includes("/folders/")) {
      const res = await axios.get(url, { timeout: 5000 });
      const html = res.data;

      // Daha sağlam kontrol: Klasör içi öğeleri say
      const fileCount = (html.match(/aria-label="[^"]+\.\w+"/g) || []).length;

      return fileCount > 0;
    }

    // Normal dosya linkleri için
    const res = await axios.head(url, { maxRedirects: 3, timeout: 5000 });
    const length = parseInt(res.headers["content-length"] || "0", 10);
    return length > 10 * 1024; // 10 KB
  } catch (error) {
    console.error("Dosya kontrol hatası:", error.message);
    return false;
  }
};


// 🟢 Not Yükleme
const uploadNote = async (req, res) => {
  try {
    const { title, description, courseId, instructor, driveLink, year } = req.body;

    // 1. URL geçerli mi?
    if (!isValidURL(driveLink)) {
      return res.status(400).json({ message: "Geçersiz veya izin verilmeyen link." });
    }

    // 2. Dosya erişilebilir ve boş değil mi?
    const fileOk = await checkFileAccessible(driveLink);
    if (!fileOk) {
      return res.status(400).json({ message: "Dosya erişilemiyor veya çok küçük (boş)." });
    }

    // 3. Not kaydet
    const newNote = await Note.create({
      title,
      description,
      courseId,
      instructor,
      driveLink,
      year,
      createdBy: req.user.userId,
      universityId: req.user.universityId
    });

    res.status(201).json({ message: "Not başarıyla yüklendi", note: newNote });
  } catch (error) {
    console.error("Not yükleme hatası:", error);
    res.status(500).json({ message: "Not yüklenemedi" });
  }
};

// 🟡 Notları Listele (opsiyonel ders filtresiyle)
const getNotes = async (req, res) => {
  try {
    const { course } = req.query;
    const filter = {
      universityId: req.user.universityId,
      isActive: true
    };

    if (course) {
      filter.courseId = course;
    }

    const notes = await Note.find(filter)
      .populate("courseId", "code name")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.json(notes);
  } catch (err) {
    console.error("Not listeleme hatası:", err);
    res.status(500).json({ message: "Notlar listelenemedi" });
  }
};

// 🟠 Tekil Not Detayı
const getNoteById = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id)
      .populate("courseId", "code name")
      .populate("createdBy", "name email");

    if (!note) {
      return res.status(404).json({ message: "Not bulunamadı" });
    }

    if (note.universityId.toString() !== req.user.universityId.toString()) {
      return res.status(403).json({ message: "Erişim yetkiniz yok" });
    }

    // Görüntülenme sayısını artır
    await Note.findByIdAndUpdate(req.params.id, { $inc: { viewCount: 1 } });
    note.viewCount += 1;

    res.json(note);
  } catch (err) {
    console.error("Not detay hatası:", err);
    res.status(500).json({ message: "Not getirilemedi" });
  }
};

// 🔵 Slug + Course ile Notları Listele
const getNotesByCourseSlug = async (req, res) => {
  try {
    const { slug, courseId } = req.params;
    const userUniversityId = req.user.universityId;

    const university = await University.findOne({ slug });
    if (!university) {
      return res.status(404).json({ message: "Üniversite bulunamadı." });
    }

    if (university._id.toString() !== userUniversityId.toString()) {
      return res.status(403).json({ message: "Bu üniversiteye erişim izniniz yok." });
    }

    const notes = await Note.find({
      courseId,
      universityId: university._id,
      isActive: true
    })
      .populate("courseId", "code name")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ notes });
  } catch (err) {
    console.error("Slug+Course ile not çekme hatası:", err);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};

// ✅ Beğeni (Like)
const likeNote = async (req, res) => {
  try {
    const noteId = req.params.id;
    const userId = req.user.userId;
    const { processDescription = "" } = req.body || {};

    const note = await Note.findById(noteId);
    if (!note) return res.status(404).json({ message: "Not bulunamadı" });

    const existingReaction = note.reactions.find(r => r.userId.toString() === userId);

    if (existingReaction) {
      if (existingReaction.type === "like") {
        // 👍 Like varsa tekrar tıklanmış = kaldır
        note.reactions = note.reactions.filter(r => r.userId.toString() !== userId);
        note.likes--;
      } else {
        // 👎 veya 🚩 varsa, önce kaldır sonra 👍 ekle
        if (existingReaction.type === "dislike") note.dislikes--;
        if (existingReaction.type === "report") note.reports--;

        note.reactions = note.reactions.filter(r => r.userId.toString() !== userId);
        note.reactions.push({ userId, type: "like", processDescription });
        note.likes++;
      }
    } else {
      // 🔄 Hiç reaksiyonu yoksa direkt ekle
      note.reactions.push({ userId, type: "like", processDescription });
      note.likes++;
    }

    await note.save();
    res.status(200).json({ message: "Beğeni güncellendi", likes: note.likes });
  } catch (err) {
    console.error("Beğeni hatası:", err);
    res.status(500).json({ message: "İşlem başarısız" });
  }
};



// ❌ Beğenmeme (dislike)
const dislikeNote = async (req, res) => {
  try {
    const noteId = req.params.id;
    const userId = req.user.userId;
    const { processDescription = "" } = req.body || {};

    const note = await Note.findById(noteId);
    if (!note) return res.status(404).json({ message: "Not bulunamadı" });

    const existingReaction = note.reactions.find(r => r.userId.toString() === userId);

    if (existingReaction) {
      if (existingReaction.type === "dislike") {
        // ❌ Zaten dislike varsa = kaldır
        note.reactions = note.reactions.filter(r => r.userId.toString() !== userId);
        note.dislikes--;
      } else {
        // 👍 veya 🚩 varsa, önce kaldır sonra ❌ ekle
        if (existingReaction.type === "like") note.likes--;
        if (existingReaction.type === "report") note.reports--;

        note.reactions = note.reactions.filter(r => r.userId.toString() !== userId);
        note.reactions.push({ userId, type: "dislike", processDescription });
        note.dislikes++;
      }
    } else {
      // 🔄 Hiç reaksiyon yoksa direkt ekle
      note.reactions.push({ userId, type: "dislike", processDescription });
      note.dislikes++;
    }

    await note.save();
    res.status(200).json({ message: "Beğenmeme güncellendi", dislikes: note.dislikes });
  } catch (err) {
    console.error("Dislike hatası:", err);
    res.status(500).json({ message: "İşlem başarısız" });
  }
};



// 🚩 Raporla (report)
const reportNote = async (req, res) => {
  try {
    const noteId = req.params.id;
    const userId = req.user.userId;
    const { processDescription = "" } = req.body || {};

    const note = await Note.findById(noteId);
    if (!note) return res.status(404).json({ message: "Not bulunamadı" });

    const existingReaction = note.reactions.find(r => r.userId.toString() === userId);

    if (existingReaction) {
      if (existingReaction.type === "report") {
        // 🚩 Zaten report varsa = kaldır
        note.reactions = note.reactions.filter(r => r.userId.toString() !== userId);
        note.reports--;
      } else {
        // 👍 veya ❌ varsa, önce kaldır sonra 🚩 ekle
        if (existingReaction.type === "like") note.likes--;
        if (existingReaction.type === "dislike") note.dislikes--;

        note.reactions = note.reactions.filter(r => r.userId.toString() !== userId);
        note.reactions.push({ userId, type: "report", processDescription });
        note.reports++;
      }
    } else {
      // 🔄 Hiç reaksiyon yoksa direkt ekle
      note.reactions.push({ userId, type: "report", processDescription });
      note.reports++;
    }

    // 🚫 10+ report varsa notu pasifleştir
    if (note.reports >= 15) {
      note.isActive = false;
    }

    await note.save();
    res.status(200).json({
      message: "Raporlama işlemi tamamlandı",
      reports: note.reports,
      isActive: note.isActive
    });
  } catch (err) {
    console.error("Report hatası:", err);
    res.status(500).json({ message: "İşlem başarısız" });
  }
};



const getTopContributors = async (req, res) => {
  try {
    const { slug } = req.params;

    const university = await University.findOne({ slug });
    if (!university) {
      return res.status(404).json({ message: "Üniversite bulunamadı." });
    }

    const topUsers = await Note.aggregate([
      { $match: { universityId: university._id, isActive: true } },
      {
        $group: {
          _id: "$createdBy",
          noteCount: { $sum: 1 },
          totalLikes: { $sum: "$likes" },
          totalDislikes: { $sum: "$dislikes" },
          totalReports: { $sum: "$reports" }
        }
      },
      { $sort: { noteCount: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "User",
          localField: "_id",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: "$user" },
      {
        $project: {
          _id: 0,
          name: "$user.name",
          profilePic: "$user.profilePic",
          score: "$user.score",
          noteCount: 1,
          totalLikes: 1,
          totalDislikes: 1,
          totalReports: 1
        }
      }
    ]);

    res.json(topUsers);
  } catch (err) {
    console.error("Top contributors hatası:", err);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};

// 🔝 En Popüler Notları Getir
const getTopNotes = async (req, res) => {
  try {
    const { slug } = req.params;
    const userUniversityId = req.user.universityId;

    // 1. Slug'a göre üniversiteyi bul
    const university = await University.findOne({ slug });
    if (!university) {
      return res.status(404).json({ message: "Üniversite bulunamadı." });
    }

    // 2. Slug ve JWT'deki üniversite eşleşiyor mu?
    if (university._id.toString() !== userUniversityId.toString()) {
      return res.status(403).json({ message: "Bu üniversiteye erişim izniniz yok." });
    }

    // 3. O üniversiteye ait en popüler notları getir
    const topNotes = await Note.find({
      universityId: university._id,
      isActive: true
    })
      .sort({ likes: -1 }) // en çok beğenilenler önce
      .limit(10)
      .populate("courseId", "code name")
      .populate("createdBy", "name score");

    // 4. Response'u sadeleştir
    const response = topNotes.map(note => ({
      id: note._id,
      title: note.title,
      likes: note.likes,
      dislikes: note.dislikes,
      reports: note.reports,
      createdAt: note.createdAt,
      course: note.courseId,
      uploader: note.createdBy
    }));

    res.json(response);
  } catch (err) {
    console.error("Top notes hatası:", err);
    res.status(500).json({ message: "Popüler notlar getirilemedi" });
  }
};


// 🔍 Not Arama
const searchNotes = async (req, res) => {
  try {
    const { slug } = req.params;
    const { q } = req.query;
    const userUniversityId = req.user.universityId;

    if (!q || q.trim() === "") {
      return res.status(400).json({ message: "Arama terimi gerekli." });
    }

    const university = await University.findOne({ slug });
    if (!university || university._id.toString() !== userUniversityId.toString()) {
      return res.status(403).json({ message: "Bu üniversiteye erişim izniniz yok." });
    }

    const regex = new RegExp(q, "i");

    // Course eşleşmeleri (name, code)
    const matchedCourses = await Course.find({
      universityId: university._id,
      $or: [{ name: regex }, { code: regex }]
    }).select("_id");

    // User eşleşmeleri (name)
    const matchedUsers = await User.find({
      universityId: university._id,
      name: regex
    }).select("_id");

    const matchedCourseIds = matchedCourses.map(c => c._id);
    const matchedUserIds = matchedUsers.map(u => u._id);

    const notes = await Note.find({
      universityId: university._id,
      isActive: true,
      $or: [
        { title: regex },
        { description: regex },
        { instructor: regex },
        { year: regex },
        { courseId: { $in: matchedCourseIds } },
        { createdBy: { $in: matchedUserIds } }
      ]
    })
      .populate("courseId", "code name")
      .populate("createdBy", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({ notes });
  } catch (err) {
    console.error("Arama hatası:", err);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};

// 🔎 Search Bar ile Not Arama (Pagination)
const searchNotesWithSearchBar = async (req, res) => {
  try {
    const { slug } = req.params;
    const { q, page = 1, limit = 15 } = req.query;
    const userUniversityId = req.user.universityId;

    if (!q || q.trim() === "") {
      return res.status(400).json({ message: "Arama terimi gerekli." });
    }

    const university = await University.findOne({ slug });
    if (!university || university._id.toString() !== userUniversityId.toString()) {
      return res.status(403).json({ message: "Bu üniversiteye erişim izniniz yok." });
    }

    const regex = new RegExp(q, "i");

    // Course code eşleşmeleri
    const matchedCourses = await Course.find({
      universityId: university._id,
      code: regex
    }).select("_id");

    const matchedCourseIds = matchedCourses.map(c => c._id);

    // Pagination hesaplamaları
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Toplam sonuç sayısı
    const totalResults = await Note.countDocuments({
      universityId: university._id,
      isActive: true,
      $or: [
        { title: regex },
        { description: regex },
        { courseId: { $in: matchedCourseIds } }
      ]
    });

    // Notları getir
    const notes = await Note.find({
      universityId: university._id,
      isActive: true,
      $or: [
        { title: regex },
        { description: regex },
        { courseId: { $in: matchedCourseIds } }
      ]
    })
      .populate("courseId", "code name")
      .populate("createdBy", "name email")
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
    console.error("Search bar arama hatası:", err);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};



module.exports = {
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
};
