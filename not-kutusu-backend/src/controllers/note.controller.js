const axios = require("axios");
const Note = require("../models/note.model");
const University = require("../models/university.model");
const Course = require("../models/course.model");
const User = require("../models/user.model");
const DepartmentCode = require("../models/departmentCode.model");
const gamificationService = require("../services/gamificationService");

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
    const {
      title,
      description,
      courseFormat,      // "split" | "single"
      departmentCode,    // Split format için
      courseNumber,      // Split format için
      fullCourseCode,    // Single format için
      instructor,
      driveLink,
      year,
      semester
    } = req.body;

    // 1. Description karakter limiti kontrolü
    if (description && description.length > 750) {
      return res.status(400).json({ message: "Açıklama 750 karakterden uzun olamaz" });
    }

    // 2. URL geçerli mi?
    if (!isValidURL(driveLink)) {
      return res.status(400).json({ message: "Geçersiz veya izin verilmeyen link." });
    }

    // 3. Dosya erişilebilir ve boş değil mi?
    const fileOk = await checkFileAccessible(driveLink);
    if (!fileOk) {
      return res.status(400).json({ message: "Dosya erişilemiyor veya çok küçük (boş)." });
    }

    // 4. Course kodunu oluştur ve normalize et
    let finalCourseCode;

    if (courseFormat === "split") {
      // Validation
      if (!departmentCode || !courseNumber) {
        return res.status(400).json({
          message: "Bölüm kodu ve ders numarası gerekli"
        });
      }

      // COMP + 101E → COMP101E
      finalCourseCode = `${departmentCode}${courseNumber}`
        .toUpperCase()
        .trim()
        .replace(/[\s-]/g, ""); // Boşluk ve tire temizle

    } else if (courseFormat === "single") {
      // Validation
      if (!fullCourseCode) {
        return res.status(400).json({
          message: "Ders kodu gerekli"
        });
      }

      // 1505001 → 1505001
      finalCourseCode = fullCourseCode
        .toUpperCase()
        .trim()
        .replace(/[\s-]/g, "");

    } else {
      return res.status(400).json({
        message: "Geçersiz ders kodu formatı (split veya single olmalı)"
      });
    }

    // Validation: Minimum uzunluk
    if (!finalCourseCode || finalCourseCode.length < 2) {
      return res.status(400).json({ message: "Geçersiz ders kodu" });
    }

    // 5. DepartmentCode kaydet
    if (courseFormat === "split" && departmentCode) {
      // Split format: departmentCode'u kaydet (COMP)
      await DepartmentCode.findOneAndUpdate(
        {
          code: departmentCode.toUpperCase().trim(),
          universityId: req.user.universityId
        },
        {
          code: departmentCode.toUpperCase().trim(),
          type: "split",
          universityId: req.user.universityId,
          addedBy: req.user.userId
        },
        { upsert: true } // Yoksa oluştur, varsa dokunma
      );
    } else if (courseFormat === "single" && fullCourseCode) {
      // Single format: fullCourseCode'u department code olarak da kaydet (1505001)
      await DepartmentCode.findOneAndUpdate(
        {
          code: fullCourseCode.toUpperCase().trim().replace(/[\s-]/g, ""),
          universityId: req.user.universityId
        },
        {
          code: fullCourseCode.toUpperCase().trim().replace(/[\s-]/g, ""),
          type: "single",
          universityId: req.user.universityId,
          addedBy: req.user.userId
        },
        { upsert: true } // Yoksa oluştur, varsa dokunma
      );
    }

    // 6. Course bul veya oluştur (ATOMIC)
    const course = await Course.findOneAndUpdate(
      {
        code: finalCourseCode,
        universityId: req.user.universityId
      },
      {
        code: finalCourseCode,
        type: courseFormat, // "split" veya "single"
        universityId: req.user.universityId,
        $inc: { noteCount: 1 } // Aynı sorguda artır
      },
      {
        upsert: true, // Yoksa oluştur
        new: true     // Güncel dökümanı döndür
      }
    );

    // 7. Yıl formatını oluştur
    const formattedYear = year && semester ? `${year} - ${semester}` : year;

    // 8. Not kaydet
    const newNote = await Note.create({
      title,
      description,
      courseId: course._id, // Course ID kullanılıyor
      instructor,
      driveLink,
      year: formattedYear,
      createdBy: req.user.userId,
      universityId: req.user.universityId
    });

    // 9. 🎮 Gamification: Not yükleme puanı
    await gamificationService.onNoteUpload(req.user.userId);

    res.status(201).json({
      message: "Not başarıyla yüklendi",
      note: newNote,
      course: {
        code: course.code,
        id: course._id
      }
    });
  } catch (error) {
    console.error("Not yükleme hatası:", error);

    // Duplicate key error (teoride imkansız ama yine de)
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Bu ders zaten mevcut, lütfen tekrar deneyin"
      });
    }

    res.status(500).json({ message: "Not yüklenemedi" });
  }
};

// 🔵 Slug + Course ile Notları Listele (courseId opsiyonel)
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

    const filter = {
      universityId: university._id,
      isActive: true
    };

    // courseId opsiyonel
    if (courseId) {
      filter.courseId = courseId;
    }

    const notes = await Note.find(filter)
      .populate("courseId", "code type noteCount")
      .populate("createdBy", "name")
      .sort({ createdAt: -1 });

    res.json(notes);
  } catch (err) {
    console.error("Slug ile not listeleme hatası:", err);
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

// ✅ Beğeni (Like)
const likeNote = async (req, res) => {
  try {
    const noteId = req.params.id;
    const userId = req.user.userId;
    const { processDescription = "" } = req.body || {};

    const note = await Note.findById(noteId);
    if (!note) return res.status(404).json({ message: "Not bulunamadı" });

    const existingReaction = note.reactions.find(r => r.userId.toString() === userId);
    let shouldSendNotification = false;

    if (existingReaction) {
      if (existingReaction.type === "like") {
        // 👍 Like varsa tekrar tıklanmış = kaldır
        note.reactions = note.reactions.filter(r => r.userId.toString() !== userId);
        note.likes--;

        // 🎮 Gamification: Like kaldırıldı
        await gamificationService.onLikeRemoved(note.createdBy.toString());
      } else {
        // 👎 veya 🚩 varsa, önce kaldır sonra 👍 ekle
        if (existingReaction.type === "dislike") note.dislikes--;
        if (existingReaction.type === "report") note.reports--;

        note.reactions = note.reactions.filter(r => r.userId.toString() !== userId);
        note.reactions.push({ userId, type: "like", processDescription });
        note.likes++;

        // 🎮 Gamification: Yeni like aldı
        await gamificationService.onLikeReceived(note.createdBy.toString());
        shouldSendNotification = true;
      }
    } else {
      // 🔄 Hiç reaksiyonu yoksa direkt ekle
      note.reactions.push({ userId, type: "like", processDescription });
      note.likes++;

      // 🎮 Gamification: Yeni like aldı
      await gamificationService.onLikeReceived(note.createdBy.toString());
      shouldSendNotification = true;
    }

    await note.save();

    // 📢 Bildirim gönder (sadece yeni like eklendiğinde)
    if (shouldSendNotification) {
      const notificationService = require("../services/notificationService");
      const io = req.app.get("io");
      await notificationService.createLikeNotification(
        userId,
        req.user.name,
        noteId,
        note.createdBy.toString(),
        io
      );
    }

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

    // Türkçe karakter normalizasyonu için yardımcı fonksiyon
    const normalizeTurkish = (text) => {
      return text
        .replace(/ı/gi, '[iıİI]')
        .replace(/i/gi, '[iıİI]')
        .replace(/ş/gi, '[şsŞS]')
        .replace(/ğ/gi, '[ğgĞG]')
        .replace(/ü/gi, '[üuÜU]')
        .replace(/ö/gi, '[öoÖO]')
        .replace(/ç/gi, '[çcÇC]');
    };

    const normalizedQuery = normalizeTurkish(q);
    const regex = new RegExp(normalizedQuery, "i");

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
        { instructor: regex },
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
        { instructor: regex },
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

// 📄 Keşfet Sayfası - Son Eklenen Notlar
const getLatestNotes = async (req, res) => {
  try {
    const { slug } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const userUniversityId = req.user.universityId;

    const university = await University.findOne({ slug });
    if (!university) {
      return res.status(404).json({ message: "Üniversite bulunamadı." });
    }

    // Güvenlik: Sadece kendi üniversitesinin notlarını görebilir
    if (university._id.toString() !== userUniversityId.toString()) {
      return res.status(403).json({ message: "Bu üniversiteye erişim izniniz yok." });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Note.countDocuments({
      universityId: university._id,
      isActive: true
    });

    const notes = await Note.find({
      universityId: university._id,
      isActive: true
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate("courseId", "code type") // Sadece code ve type
      .populate("createdBy", "name") // Sadece name
      .select("title instructor year driveLink createdAt") // Sadece gerekli alanlar
      .lean();

    // Response formatı: Title, Course Code, Instructor, Dönem, Yüklenme Tarihi, DriveLink
    const formattedNotes = notes.map(note => ({
      id: note._id,
      title: note.title,
      courseCode: note.courseId?.code || "N/A",
      courseType: note.courseId?.type || "N/A",
      instructor: note.instructor || "Belirtilmemiş",
      semester: note.year || "Belirtilmemiş",
      uploadDate: note.createdAt,
      driveLink: note.driveLink,
      uploadedBy: note.createdBy?.name || "Anonim"
    }));

    res.json({
      notes: formattedNotes,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalNotes: total,
        hasNextPage: skip + notes.length < total
      }
    });
  } catch (err) {
    console.error("Son eklenen notlar hatası:", err);
    res.status(500).json({ message: "Notlar getirilemedi" });
  }
};

// 📝 Notu Güncelle (Sadece Kendisi)
const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const userUniversityId = req.user.universityId;
    const { title, description, instructor, year, semester, driveLink } = req.body;

    // Validation: En az bir alan gönderilmiş mi?
    if (!title && description === undefined && !instructor && !year && !semester && !driveLink) {
      return res.status(400).json({ message: "Güncellenecek en az bir alan belirtmelisiniz" });
    }

    // Validation: Title uzunluk kontrolü
    if (title && (title.trim().length < 3 || title.trim().length > 100)) {
      return res.status(400).json({ message: "Başlık 3-100 karakter arasında olmalıdır" });
    }

    // Validation: DriveLink format kontrolü
    if (driveLink && !driveLink.startsWith("https://drive.google.com/")) {
      return res.status(400).json({ message: "Geçerli bir Google Drive linki giriniz" });
    }

    const note = await Note.findById(id);
    if (!note) {
      return res.status(404).json({ message: "Not bulunamadı" });
    }

    // 🔒 Güvenlik 1: Sadece kendi notunu güncelleyebilir
    if (note.createdBy.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Bu notu düzenleme yetkiniz yok" });
    }

    // 🔒 Güvenlik 2: Üniversite kontrolü
    if (note.universityId.toString() !== userUniversityId.toString()) {
      return res.status(403).json({ message: "Erişim izniniz yok" });
    }

    // 🔒 Güvenlik 3: Pasif notlar güncellenemez
    if (!note.isActive) {
      return res.status(403).json({ message: "Pasif notlar güncellenemez" });
    }

    // Güncellenebilir alanlar (sanitize edilmiş)
    if (title) note.title = title.trim();
    if (description !== undefined) note.description = description.trim();
    if (instructor !== undefined) note.instructor = instructor.trim();
    if (driveLink) note.driveLink = driveLink.trim();

    // Dönem formatı
    if (year && semester) {
      note.year = `${year.trim()} - ${semester.trim()}`;
    } else if (year) {
      note.year = year.trim();
    }

    await note.save();

    res.json({
      message: "Not başarıyla güncellendi",
      note: {
        _id: note._id,
        title: note.title,
        description: note.description,
        instructor: note.instructor,
        year: note.year,
        driveLink: note.driveLink
      }
    });
  } catch (err) {
    console.error("Not güncelleme hatası:", err);
    res.status(500).json({ message: "Not güncellenemedi" });
  }
};

// 🗑️ Notu Sil (Soft Delete - Pasifleştir)
const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const userUniversityId = req.user.universityId;

    const note = await Note.findById(id);
    if (!note) {
      return res.status(404).json({ message: "Not bulunamadı" });
    }

    // 🔒 Güvenlik 1: Sadece kendi notunu silebilir
    if (note.createdBy.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Bu notu silme yetkiniz yok" });
    }

    // 🔒 Güvenlik 2: Üniversite kontrolü
    if (note.universityId.toString() !== userUniversityId.toString()) {
      return res.status(403).json({ message: "Erişim izniniz yok" });
    }

    // 🔒 Güvenlik 3: Zaten pasifse tekrar silme
    if (!note.isActive) {
      return res.status(400).json({ message: "Bu not zaten pasif durumda" });
    }

    // Soft delete
    note.isActive = false;
    await note.save();

    // 🎮 Gamification: Not silme puanı
    await gamificationService.onNoteDelete(userId);

    // Course noteCount azalt
    await Course.findByIdAndUpdate(note.courseId, { $inc: { noteCount: -1 } });

    res.json({
      message: "Not pasifleştirildi (admin panelde görünmeye devam edecek)",
      noteId: note._id
    });
  } catch (err) {
    console.error("Not silme hatası:", err);
    res.status(500).json({ message: "Not silinemedi" });
  }
};



module.exports = {
  uploadNote,
  getNoteById,
  getNotesByCourseSlug,
  likeNote,
  dislikeNote,
  reportNote,
  getTopContributors,
  getTopNotes,
  searchNotes,
  searchNotesWithSearchBar,
  getLatestNotes,
  updateNote,
  deleteNote
};
