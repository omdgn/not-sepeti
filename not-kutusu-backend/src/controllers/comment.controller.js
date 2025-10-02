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

    res.json({ comments });
  } catch (err) {
    console.error("Yorum listeleme hatası:", err);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};

// ✅ Like
const likeComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    const userId = req.user.userId;
    const { commentDescription = "" } = req.body || {};

    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: "Yorum bulunamadı" });

    const existingReaction = comment.reactions.find(r => r.userId.toString() === userId);

    if (existingReaction) {
      if (existingReaction.type === "like") {
        comment.reactions = comment.reactions.filter(r => r.userId.toString() !== userId);
        comment.likes--;
      } else {
        if (existingReaction.type === "dislike") comment.dislikes--;
        if (existingReaction.type === "report") comment.reports--;

        comment.reactions = comment.reactions.filter(r => r.userId.toString() !== userId);
        comment.reactions.push({ userId, type: "like", commentDescription });
        comment.likes++;
      }
    } else {
      comment.reactions.push({ userId, type: "like", commentDescription });
      comment.likes++;
    }

    await comment.save();
    res.status(200).json({ message: "Yorum beğenildi", likes: comment.likes });
  } catch (err) {
    console.error("Yorum beğeni hatası:", err);
    res.status(500).json({ message: "İşlem başarısız" });
  }
};


// ❌ Dislike
const dislikeComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    const userId = req.user.userId;
    const { commentDescription = "" } = req.body || {};

    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: "Yorum bulunamadı" });

    const existingReaction = comment.reactions.find(r => r.userId.toString() === userId);

    if (existingReaction) {
      if (existingReaction.type === "dislike") {
        comment.reactions = comment.reactions.filter(r => r.userId.toString() !== userId);
        comment.dislikes--;
      } else {
        if (existingReaction.type === "like") comment.likes--;
        if (existingReaction.type === "report") comment.reports--;

        comment.reactions = comment.reactions.filter(r => r.userId.toString() !== userId);
        comment.reactions.push({ userId, type: "dislike", commentDescription });
        comment.dislikes++;
      }
    } else {
      comment.reactions.push({ userId, type: "dislike", commentDescription });
      comment.dislikes++;
    }

    await comment.save();
    res.status(200).json({ message: "Yorum beğenilmedi", dislikes: comment.dislikes });
  } catch (err) {
    console.error("Yorum dislike hatası:", err);
    res.status(500).json({ message: "İşlem başarısız" });
  }
};


// 🚩 Report
const reportComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    const userId = req.user.userId;
    const { commentDescription = "" } = req.body || {};

    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: "Yorum bulunamadı" });

    const existingReaction = comment.reactions.find(r => r.userId.toString() === userId);

    if (existingReaction) {
      if (existingReaction.type === "report") {
        comment.reactions = comment.reactions.filter(r => r.userId.toString() !== userId);
        comment.reports--;
      } else {
        if (existingReaction.type === "like") comment.likes--;
        if (existingReaction.type === "dislike") comment.dislikes--;

        comment.reactions = comment.reactions.filter(r => r.userId.toString() !== userId);
        comment.reactions.push({ userId, type: "report", commentDescription });
        comment.reports++;
      }
    } else {
      comment.reactions.push({ userId, type: "report", commentDescription });
      comment.reports++;
    }

    await comment.save();
    res.status(200).json({ message: "Yorum raporlandı", reports: comment.reports });
  } catch (err) {
    console.error("Yorum report hatası:", err);
    res.status(500).json({ message: "İşlem başarısız" });
  }
};



module.exports = {
  addComment,
  deleteComment,
  getCommentsForNote,
  likeComment,
  dislikeComment,
  reportComment
};

