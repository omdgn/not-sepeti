const Reaction = require("../models/reaction.model");
const Note = require("../models/note.model");
const Comment = require("../models/comment.model");
const gamificationService = require("../services/gamificationService");

/**
 * Helper: Counter'ı güncelle (transaction-safe)
 */
const updateCounter = async (targetType, targetId, field, increment) => {
  const Model = targetType === "notes" ? Note : Comment;
  console.log('Updating counter:', { targetType, targetId, field, increment, Model: Model.modelName });
  const result = await Model.findByIdAndUpdate(targetId, { $inc: { [field]: increment } }, { new: true });
  console.log('Counter updated, new value:', result ? result[field] : 'NOT FOUND');
  return result;
};

/**
 * Helper: Bildirim gönder (sadece like için, sadece note için)
 */
const sendLikeNotification = async (userId, userName, noteId, noteOwnerId, io) => {
  if (noteOwnerId === userId) return; // Kendi notunu beğenen bildirim almaz

  const notificationService = require("../services/notificationService");
  await notificationService.createLikeNotification(
    userId,
    userName,
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

    // Target var mı?
    const Model = targetType === "notes" ? Note : Comment;
    const target = await Model.findById(targetId);
    if (!target) {
      return res.status(404).json({ message: `${targetType} bulunamadı` });
    }

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
        await Reaction.findByIdAndDelete(existingReaction._id);
        await updateCounter(targetType, targetId, "likes", -1);

        // 🎮 Gamification: Like kaldırıldı (sadece note için)
        if (targetType === "notes") {
          await gamificationService.onLikeRemoved(target.createdBy.toString());
        }

      } else {
        // 👎 veya 🚩 → önce kaldır, sonra 👍 ekle
        const oldType = existingReaction.type;

        existingReaction.type = "like";
        existingReaction.description = undefined; // Like için description yok
        existingReaction.timestamp = new Date();
        await existingReaction.save();

        // Counter güncelle
        await updateCounter(targetType, targetId, `${oldType}s`, -1);
        await updateCounter(targetType, targetId, "likes", 1);

        // 🎮 Gamification: Yeni like aldı (sadece note için)
        if (targetType === "notes") {
          await gamificationService.onLikeReceived(target.createdBy.toString());
          shouldSendNotification = true;
        }
      }
    } else {
      // 🔄 Hiç reaction yoksa → yeni ekle
      console.log('Creating reaction:', { userId, targetType, targetId, type: 'like' });
      const newReaction = await Reaction.create({
        userId,
        targetType,
        targetId,
        type: "like"
        // description: like için gerekli değil
      });
      console.log('Reaction created:', newReaction);

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
        req.user.name,
        targetId,
        target.createdBy.toString(),
        io
      );
    }

    // Güncel counter değerlerini al
    const updatedTarget = await Model.findById(targetId).select("likes");

    res.status(200).json({
      message: "Beğeni güncellendi",
      likes: updatedTarget.likes
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

    const Model = targetType === "note" ? Note : Comment;
    const target = await Model.findById(targetId);
    if (!target) {
      return res.status(404).json({ message: `${targetType} bulunamadı` });
    }

    const existingReaction = await Reaction.findOne({
      userId,
      targetType,
      targetId
    });

    if (existingReaction) {
      if (existingReaction.type === "dislike") {
        // ❌ Zaten dislike varsa → kaldır
        await Reaction.findByIdAndDelete(existingReaction._id);
        await updateCounter(targetType, targetId, "dislikes", -1);

      } else {
        // 👍 veya 🚩 → önce kaldır, sonra ❌ ekle
        const oldType = existingReaction.type;

        existingReaction.type = "dislike";
        existingReaction.description = undefined; // Dislike için description yok
        existingReaction.timestamp = new Date();
        await existingReaction.save();

        await updateCounter(targetType, targetId, `${oldType}s`, -1);
        await updateCounter(targetType, targetId, "dislikes", 1);
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

    res.status(200).json({
      message: "Beğenmeme güncellendi",
      dislikes: updatedTarget.dislikes
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

    const Model = targetType === "note" ? Note : Comment;
    const target = await Model.findById(targetId);
    if (!target) {
      return res.status(404).json({ message: `${targetType} bulunamadı` });
    }

    const existingReaction = await Reaction.findOne({
      userId,
      targetType,
      targetId
    });

    if (existingReaction) {
      if (existingReaction.type === "report") {
        // 🚩 Zaten report varsa → kaldır
        await Reaction.findByIdAndDelete(existingReaction._id);
        await updateCounter(targetType, targetId, "reports", -1);

      } else {
        // 👍 veya ❌ → önce kaldır, sonra 🚩 ekle
        const oldType = existingReaction.type;

        existingReaction.type = "report";
        existingReaction.description = finalDescription;
        existingReaction.timestamp = new Date();
        await existingReaction.save();

        await updateCounter(targetType, targetId, `${oldType}s`, -1);
        await updateCounter(targetType, targetId, "reports", 1);
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
    const updatedTarget = await Model.findById(targetId).select("reports isActive");

    if (targetType === "notes" && updatedTarget.reports >= 15) {
      updatedTarget.isActive = false;
      await updatedTarget.save();
    }

    res.status(200).json({
      message: "Raporlama işlemi tamamlandı",
      reports: updatedTarget.reports,
      isActive: updatedTarget.isActive !== undefined ? updatedTarget.isActive : true
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
