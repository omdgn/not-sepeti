const Reaction = require("../models/reaction.model");
const Note = require("../models/note.model");
const Comment = require("../models/comment.model");
const gamificationService = require("../services/gamificationService");

/**
 * 🔒 Helper: Üniversite erişim kontrolü (cross-university access prevention)
 * @returns { valid: boolean, target: Object, statusCode: number, message: string }
 */
const validateUniversityAccess = async (targetType, targetId, userUniversityId) => {
  const Model = targetType === "notes" ? Note : Comment;

  if (targetType === "notes") {
    // Note için direkt universityId kontrolü
    const note = await Model.findById(targetId).select('universityId createdBy');
    if (!note) {
      return { valid: false, message: "Not bulunamadı", statusCode: 404 };
    }
    if (note.universityId.toString() !== userUniversityId.toString()) {
      return { valid: false, message: "Bu nota erişim yetkiniz yok", statusCode: 403 };
    }
    return { valid: true, target: note };

  } else {
    // Comment için noteId üzerinden üniversite kontrolü
    const comment = await Model.findById(targetId).populate('noteId', 'universityId');
    if (!comment || !comment.noteId) {
      return { valid: false, message: "Yorum bulunamadı", statusCode: 404 };
    }
    if (comment.noteId.universityId.toString() !== userUniversityId.toString()) {
      return { valid: false, message: "Bu yoruma erişim yetkiniz yok", statusCode: 403 };
    }
    return { valid: true, target: comment };
  }
};

/**
 * Helper: Counter'ı güncelle (atomic ve validation-safe)
 */
const updateCounter = async (targetType, targetId, field, increment) => {
  const Model = targetType === "notes" ? Note : Comment;

  const result = await Model.findByIdAndUpdate(
    targetId,
    { $inc: { [field]: increment } },
    {
      new: true,           // Güncel değeri döndür
      runValidators: true  // ✅ Validation kontrolleri çalıştır
    }
  );

  // ✅ Target bulunamazsa hata fırlat (counter desync önleme)
  if (!result) {
    console.error(`Counter güncelleme hatası: ${targetType} bulunamadı (ID: ${targetId})`);
    // Not: Hata fırlatmıyoruz çünkü kullanıcı deneyimini bozmak istemiyoruz
    // Ama log'da kayıt altına alıyoruz
  }

  return result;
};

/**
 * Helper: Bildirim gönder (sadece like için, sadece note için)
 */
const sendLikeNotification = async (userId, noteId, noteOwnerId, io) => {
  if (noteOwnerId === userId) return; // Kendi notunu beğenen bildirim almaz

  const notificationService = require("../services/notificationService");
  await notificationService.createLikeNotification(
    userId,
    noteId,
    noteOwnerId,
    io
  );
};

/**
 * ✅ Like
 * POST /api/:targetType/:id/like
 * Body: description gereksiz (like için açıklama kullanılmaz)
 */
const likeTarget = async (req, res) => {
  try {
    let { targetType, id: targetId } = req.params;
    const userId = req.user.userId;

    // Tekil → çoğul dönüşümü (model uyumluluğu için)
    const typeMap = {
      "notes": "notes",
      "note": "notes",
      "comments": "comments",
      "comment": "comments"
    };
    targetType = typeMap[targetType];

    // Validation
    if (!targetType) {
      return res.status(400).json({ message: "Geçersiz targetType" });
    }

    // 🔒 Üniversite erişim kontrolü (cross-university access prevention)
    const validation = await validateUniversityAccess(targetType, targetId, req.user.universityId);
    if (!validation.valid) {
      return res.status(validation.statusCode).json({ message: validation.message });
    }
    const target = validation.target;

    // Model belirleme (reaction.controller scope'unda kullanmak için)
    const Model = targetType === "notes" ? Note : Comment;

    // Mevcut reaction var mı?
    const existingReaction = await Reaction.findOne({
      userId,
      targetType,
      targetId
    });

    let shouldSendNotification = false;

    if (existingReaction) {
      if (existingReaction.type === "like") {
        // 👍 Zaten like varsa → kaldır
        const deletedReaction = await Reaction.findByIdAndDelete(existingReaction._id);

        // ✅ Silme başarılıysa counter güncelle
        if (deletedReaction) {
          await updateCounter(targetType, targetId, "likes", -1);

          // 🎮 Gamification: Like kaldırıldı (sadece note için)
          if (targetType === "notes") {
            await gamificationService.onLikeRemoved(target.createdBy.toString());
          }
        }

      } else {
        // 👎 veya 🚩 → önce kaldır, sonra 👍 ekle
        const oldType = existingReaction.type;

        // 🔒 Atomik işlem: Reaction ve counter'ı paralel güncelle
        await Promise.all([
          (async () => {
            existingReaction.type = "like";
            existingReaction.description = undefined;
            existingReaction.timestamp = new Date();
            await existingReaction.save();
          })(),
          // Counter'ları tek sorguda güncelle (race condition önleme)
          Model.findByIdAndUpdate(targetId, {
            $inc: { [`${oldType}s`]: -1, likes: 1 }
          }, { runValidators: true })
        ]);

        // 🎮 Gamification: Yeni like aldı (sadece note için)
        if (targetType === "notes") {
          await gamificationService.onLikeReceived(target.createdBy.toString());
          shouldSendNotification = true;
        }
      }
    } else {
      // 🔄 Hiç reaction yoksa → yeni ekle
      await Reaction.create({
        userId,
        targetType,
        targetId,
        type: "like"
        // description: like için gerekli değil
      });

      await updateCounter(targetType, targetId, "likes", 1);

      // 🎮 Gamification: Yeni like aldı (sadece note için)
      if (targetType === "notes") {
        await gamificationService.onLikeReceived(target.createdBy.toString());
        shouldSendNotification = true;
      }
    }

    // 📢 Bildirim gönder (sadece like eklendiğinde, sadece note için)
    if (shouldSendNotification && targetType === "notes") {
      const io = req.app.get("io");
      await sendLikeNotification(
        userId,
        targetId,
        target.createdBy.toString(),
        io
      );
    }

    // Güncel counter değerlerini al
    const updatedTarget = await Model.findById(targetId).select("likes");

    // Kullanıcının mevcut reaction durumunu al
    const currentReaction = await Reaction.findOne({
      userId,
      targetType,
      targetId
    }).select("type description timestamp");

    res.status(200).json({
      message: "Beğeni güncellendi",
      likes: updatedTarget.likes,
      myReaction: currentReaction ? {
        type: currentReaction.type,
        description: currentReaction.description,
        timestamp: currentReaction.timestamp
      } : null
    });

  } catch (err) {
    console.error("Like hatası:", err);
    res.status(500).json({ message: "İşlem başarısız" });
  }
};

/**
 * ❌ Dislike
 * POST /api/:targetType/:id/dislike
 * Body: description gereksiz (dislike için açıklama kullanılmaz)
 */
const dislikeTarget = async (req, res) => {
  try {
    let { targetType, id: targetId } = req.params;
    const userId = req.user.userId;

    // Tekil → çoğul dönüşümü (model uyumluluğu için)
    const typeMap = {
      "notes": "notes",
      "note": "notes",
      "comments": "comments",
      "comment": "comments"
    };
    targetType = typeMap[targetType];

    if (!targetType) {
      return res.status(400).json({ message: "Geçersiz targetType" });
    }

    // 🔒 Üniversite erişim kontrolü (cross-university access prevention)
    const validation = await validateUniversityAccess(targetType, targetId, req.user.universityId);
    if (!validation.valid) {
      return res.status(validation.statusCode).json({ message: validation.message });
    }
    const target = validation.target;

    const Model = targetType === "notes" ? Note : Comment;

    const existingReaction = await Reaction.findOne({
      userId,
      targetType,
      targetId
    });

    if (existingReaction) {
      if (existingReaction.type === "dislike") {
        // ❌ Zaten dislike varsa → kaldır
        const deletedReaction = await Reaction.findByIdAndDelete(existingReaction._id);

        // ✅ Silme başarılıysa counter güncelle
        if (deletedReaction) {
          await updateCounter(targetType, targetId, "dislikes", -1);
        }

      } else {
        // 👍 veya 🚩 → önce kaldır, sonra ❌ ekle
        const oldType = existingReaction.type;

        // 🔒 Atomik işlem: Reaction ve counter'ı paralel güncelle
        await Promise.all([
          (async () => {
            existingReaction.type = "dislike";
            existingReaction.description = undefined;
            existingReaction.timestamp = new Date();
            await existingReaction.save();
          })(),
          // Counter'ları tek sorguda güncelle (race condition önleme)
          Model.findByIdAndUpdate(targetId, {
            $inc: { [`${oldType}s`]: -1, dislikes: 1 }
          }, { runValidators: true })
        ]);
      }
    } else {
      // 🔄 Hiç reaction yoksa → yeni ekle
      await Reaction.create({
        userId,
        targetType,
        targetId,
        type: "dislike"
        // description: dislike için gerekli değil
      });

      await updateCounter(targetType, targetId, "dislikes", 1);
    }

    const updatedTarget = await Model.findById(targetId).select("dislikes");

    // Kullanıcının mevcut reaction durumunu al
    const currentReaction = await Reaction.findOne({
      userId,
      targetType,
      targetId
    }).select("type description timestamp");

    res.status(200).json({
      message: "Beğenmeme güncellendi",
      dislikes: updatedTarget.dislikes,
      myReaction: currentReaction ? {
        type: currentReaction.type,
        description: currentReaction.description,
        timestamp: currentReaction.timestamp
      } : null
    });

  } catch (err) {
    console.error("Dislike hatası:", err);
    res.status(500).json({ message: "İşlem başarısız" });
  }
};

/**
 * 🚩 Report
 * POST /api/:targetType/:id/report
 * Body: { processDescription, commentDescription, description } (opsiyonel, herhangi biri)
 */
const reportTarget = async (req, res) => {
  try {
    let { targetType, id: targetId } = req.params;
    const userId = req.user.userId;

    // Backward compatibility: processDescription, commentDescription veya description
    const { processDescription, commentDescription, description } = req.body || {};
    const finalDescription = processDescription || commentDescription || description || "";

    // Tekil → çoğul dönüşümü (model uyumluluğu için)
    const typeMap = {
      "notes": "notes",
      "note": "notes",
      "comments": "comments",
      "comment": "comments"
    };
    targetType = typeMap[targetType];

    if (!targetType) {
      return res.status(400).json({ message: "Geçersiz targetType" });
    }

    // 🔒 Üniversite erişim kontrolü (cross-university access prevention)
    const validation = await validateUniversityAccess(targetType, targetId, req.user.universityId);
    if (!validation.valid) {
      return res.status(validation.statusCode).json({ message: validation.message });
    }
    const target = validation.target;

    const Model = targetType === "notes" ? Note : Comment;

    const existingReaction = await Reaction.findOne({
      userId,
      targetType,
      targetId
    });

    if (existingReaction) {
      if (existingReaction.type === "report") {
        // 🚩 Zaten report varsa → kaldır
        const deletedReaction = await Reaction.findByIdAndDelete(existingReaction._id);

        // ✅ Silme başarılıysa counter güncelle
        if (deletedReaction) {
          await updateCounter(targetType, targetId, "reports", -1);
        }

      } else {
        // 👍 veya ❌ → önce kaldır, sonra 🚩 ekle
        const oldType = existingReaction.type;

        // 🔒 Atomik işlem: Reaction ve counter'ı paralel güncelle
        await Promise.all([
          (async () => {
            existingReaction.type = "report";
            existingReaction.description = finalDescription;
            existingReaction.timestamp = new Date();
            await existingReaction.save();
          })(),
          // Counter'ları tek sorguda güncelle (race condition önleme)
          Model.findByIdAndUpdate(targetId, {
            $inc: { [`${oldType}s`]: -1, reports: 1 }
          }, { runValidators: true })
        ]);
      }
    } else {
      // 🔄 Hiç reaction yoksa → yeni ekle
      await Reaction.create({
        userId,
        targetType,
        targetId,
        type: "report",
        description: finalDescription
      });

      await updateCounter(targetType, targetId, "reports", 1);
    }

    // 🚫 15+ report varsa pasifleştir (sadece note için)
    const updatedTarget = await Model.findById(targetId).select("reports isActive courseId createdBy");

    if (targetType === "notes" && updatedTarget.reports >= 15 && updatedTarget.isActive) {
      updatedTarget.isActive = false;
      await updatedTarget.save();

      // Course noteCount azalt
      const Course = require("../models/course.model");
      await Course.findByIdAndUpdate(updatedTarget.courseId, { $inc: { noteCount: -1 } });

      // 🎮 Gamification: Not silme puanı (raporlama nedeniyle)
      await gamificationService.onNoteDelete(updatedTarget.createdBy.toString());
    }

    // Kullanıcının mevcut reaction durumunu al
    const currentReaction = await Reaction.findOne({
      userId,
      targetType,
      targetId
    }).select("type description timestamp");

    res.status(200).json({
      message: "Raporlama işlemi tamamlandı",
      reports: updatedTarget.reports,
      isActive: updatedTarget.isActive !== undefined ? updatedTarget.isActive : true,
      myReaction: currentReaction ? {
        type: currentReaction.type,
        description: currentReaction.description,
        timestamp: currentReaction.timestamp
      } : null
    });

  } catch (err) {
    console.error("Report hatası:", err);
    res.status(500).json({ message: "İşlem başarısız" });
  }
};

/**
 * 🔍 Kullanıcının bir target için reaction durumunu getir
 * GET /api/:targetType/:id/my-reaction
 */
const getMyReaction = async (req, res) => {
  try {
    let { targetType, id: targetId } = req.params;
    const userId = req.user.userId;

    // Tekil → çoğul dönüşümü (model uyumluluğu için)
    const typeMap = {
      "notes": "notes",
      "note": "notes",
      "comments": "comments",
      "comment": "comments"
    };
    targetType = typeMap[targetType];

    if (!targetType) {
      return res.status(400).json({ message: "Geçersiz targetType" });
    }

    // 🔒 Üniversite erişim kontrolü (cross-university access prevention)
    const validation = await validateUniversityAccess(targetType, targetId, req.user.universityId);
    if (!validation.valid) {
      return res.status(validation.statusCode).json({ message: validation.message });
    }

    const reaction = await Reaction.findOne({
      userId,
      targetType,
      targetId
    }).select("type description timestamp");

    res.json({
      hasReaction: !!reaction,
      reaction: reaction || null
    });

  } catch (err) {
    console.error("My reaction hatası:", err);
    res.status(500).json({ message: "İşlem başarısız" });
  }
};

module.exports = {
  likeTarget,
  dislikeTarget,
  reportTarget,
  getMyReaction
};
