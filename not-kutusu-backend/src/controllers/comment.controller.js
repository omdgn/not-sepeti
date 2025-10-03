const Comment = require("../models/comment.model");
const Note = require("../models/note.model");
const gamificationService = require("../services/gamificationService");

// 🟢 Yorum Ekle 
const addComment = async (req, res) => {
  try {
    const { noteId } = req.params;
    const { text } = req.body || {};
    const userId = req.user.userId;
    const userUniversityId = req.user.universityId;

    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return res.status(400).json({ message: "Yorum metni gerekli." });
    }

    if (text.length > 350) {
      return res.status(400).json({ message: "Yorum 350 karakterden uzun olamaz." });
    }

    const note = await Note.findById(noteId);
    if (!note) {
      return res.status(404).json({ message: "Not bulunamadı" });
    }

    if (note.universityId.toString() !== userUniversityId.toString()) {
      return res.status(403).json({ message: "Bu nota yorum yapma yetkiniz yok" });
    }

    const newComment = await Comment.create({
      noteId,
      userId,
      text: text.trim()
    });

    // userId'yi populate et
    await newComment.populate("userId", "name");

    // 🎮 Gamification: Yorum puanı
    await gamificationService.onCommentPost(userId);

    // 📢 Bildirim gönder
    const notificationService = require("../services/notificationService");
    const io = req.app.get("io");
    await notificationService.createCommentNotification(
      userId,
      req.user.name,
      text.trim(),
      noteId,
      note.createdBy.toString(),
      io
    );

    res.status(201).json({ message: "Yorum eklendi", comment: newComment });
  } catch (err) {
    console.error("Yorum ekleme hatası:", err);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};



// 🗑️ Yorumu Sil
const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const comment = await Comment.findById(id).populate("noteId");
    if (!comment) {
      return res.status(404).json({ message: "Yorum bulunamadı" });
    }

    // Üniversite kontrolü
    if (comment.noteId.universityId.toString() !== req.user.universityId.toString()) {
      return res.status(403).json({ message: "Bu yoruma erişim yetkiniz yok" });
    }

    // Kullanıcı kendisine ait mi?
    if (comment.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Sadece kendi yorumunuzu silebilirsiniz" });
    }

    await Comment.findByIdAndDelete(id);

    // 🎮 Gamification: Yorum silme puanı
    await gamificationService.onCommentDelete(userId);

    res.json({ message: "Yorum silindi" });
  } catch (err) {
    console.error("Yorum silme hatası:", err);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};


// 🟡 Notun yorumlarını getir
const getCommentsForNote = async (req, res) => {
  try {
    const { noteId } = req.params;
    const userId = req.user.userId;
    const userUniversityId = req.user.universityId;

    const note = await Note.findById(noteId);
    if (!note) {
      return res.status(404).json({ message: "Not bulunamadı" });
    }

    if (note.universityId.toString() !== userUniversityId.toString()) {
      return res.status(403).json({ message: "Bu nota erişim izniniz yok" });
    }

    const comments = await Comment.find({ noteId })
      .populate("userId", "name")
      .sort({ createdAt: -1 });

    // 🆕 Tüm yorumlar için kullanıcının reaction'larını tek sorguda çek
    const Reaction = require("../models/reaction.model");
    const commentIds = comments.map(c => c._id);

    const reactions = await Reaction.find({
      userId: userId,
      targetType: "comment",
      targetId: { $in: commentIds }
    }).select("targetId type description timestamp");

    // Her yoruma kendi reaction'ını ekle
    const commentsWithReactions = comments.map(comment => {
      const myReaction = reactions.find(r => r.targetId.toString() === comment._id.toString());
      return {
        ...comment.toObject(),
        myReaction: myReaction ? {
          type: myReaction.type,
          description: myReaction.description,
          timestamp: myReaction.timestamp
        } : null
      };
    });

    res.json({ comments: commentsWithReactions });
  } catch (err) {
    console.error("Yorum listeleme hatası:", err);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};

// ⚠️ DEPRECATED: Reaction işlemleri artık reaction.controller.js'de
// Yeni route: POST /api/:targetType/:id/like (targetType = "comment")



module.exports = {
  addComment,
  deleteComment,
  getCommentsForNote
};

