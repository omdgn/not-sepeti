const Notification = require("../models/notification.model");
const User = require("../models/user.model");
const { emitToUser } = require("./socketService");

// ❤️ Beğeni Bildirimi (Aggregated)
const createLikeNotification = async (fromUserId, noteId, noteCreatedBy, io) => {
  try {
    // Kendi notunu beğenirse bildirim gönderme
    if (fromUserId.toString() === noteCreatedBy.toString()) {
      return;
    }

    // 📢 Bildirim tercihi kontrolü
    const receiver = await User.findById(noteCreatedBy).select("notifications");
    if (!receiver || receiver.notifications === false) {
      return; // Bildirimler kapalıysa gönderme
    }

    const notification = await Notification.findOneAndUpdate(
      {
        userId: noteCreatedBy,
        type: "like",
        relatedNoteId: noteId,
        isRead: false // Sadece okunmamışları güncelle
      },
      {
        $inc: { count: 1 },
        $push: {
          lastActors: {
            $each: [{ userId: fromUserId }],
            $position: 0, // Başa ekle
            $slice: 3 // Max 3 kişi
          }
        },
        lastUpdated: new Date()
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true
      }
    );

    // Socket.io emit
    if (io) {
      const message = notification.count === 1
        ? "Notunuz beğenildi"
        : `Notunuz ${notification.count} kişi tarafından beğenildi`;

      emitToUser(io, noteCreatedBy, "notification", {
        type: "like",
        count: notification.count,
        message,
        notificationId: notification._id
      });
    }

    return notification;
  } catch (err) {
    console.error("createLikeNotification hatası:", err);
  }
};

// 💬 Yorum Bildirimi (Aggregated)
const createCommentNotification = async (fromUserId, commentText, noteId, noteCreatedBy, io) => {
  try {
    // Kendi notuna yorum yaparsa bildirim gönderme
    if (fromUserId.toString() === noteCreatedBy.toString()) {
      return;
    }

    // 📢 Bildirim tercihi kontrolü
    const receiver = await User.findById(noteCreatedBy).select("notifications");
    if (!receiver || receiver.notifications === false) {
      return; // Bildirimler kapalıysa gönderme
    }

    const notification = await Notification.findOneAndUpdate(
      {
        userId: noteCreatedBy,
        type: "comment",
        relatedNoteId: noteId,
        isRead: false
      },
      {
        $inc: { count: 1 },
        $push: {
          lastActors: {
            $each: [{ userId: fromUserId }],
            $position: 0,
            $slice: 3
          }
        },
        $set: { lastComment: commentText.substring(0, 100) }, // İlk 100 karakter
        lastUpdated: new Date()
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true
      }
    );

    // Socket.io emit
    if (io) {
      const message = notification.count === 1
        ? `Notunuza yorum yapıldı: "${notification.lastComment}"`
        : `Notunuza ${notification.count} yorum yapıldı`;

      emitToUser(io, noteCreatedBy, "notification", {
        type: "comment",
        count: notification.count,
        message,
        lastComment: notification.lastComment,
        notificationId: notification._id
      });
    }

    return notification;
  } catch (err) {
    console.error("createCommentNotification hatası:", err);
  }
};

// 🏅 Rozet Bildirimi
const createBadgeNotification = async (userId, badge, io) => {
  try {
    // 📢 Bildirim tercihi kontrolü
    const receiver = await User.findById(userId).select("notifications");
    if (!receiver || receiver.notifications === false) {
      return; // Bildirimler kapalıysa gönderme
    }

    const notification = await Notification.create({
      userId,
      type: "badge",
      badge: {
        id: badge.id,
        name: badge.name,
        icon: badge.icon
      },
      isRead: false
    });

    // Socket.io emit
    if (io) {
      emitToUser(io, userId, "notification", {
        type: "badge",
        badge: badge,
        message: `🎉 ${badge.icon} ${badge.name} rozetini kazandınız!`,
        notificationId: notification._id
      });
    }

    return notification;
  } catch (err) {
    console.error("createBadgeNotification hatası:", err);
  }
};

// 📈 Seviye Atlama Bildirimi
const createLevelUpNotification = async (userId, newLevel, levelName, io) => {
  try {
    // 📢 Bildirim tercihi kontrolü
    const receiver = await User.findById(userId).select("notifications");
    if (!receiver || receiver.notifications === false) {
      return; // Bildirimler kapalıysa gönderme
    }

    const notification = await Notification.create({
      userId,
      type: "level_up",
      newLevel,
      isRead: false
    });

    // Socket.io emit
    if (io) {
      emitToUser(io, userId, "notification", {
        type: "level_up",
        newLevel,
        levelName,
        message: `🎖️ Tebrikler! Level ${newLevel} - ${levelName} oldunuz`,
        notificationId: notification._id
      });
    }

    return notification;
  } catch (err) {
    console.error("createLevelUpNotification hatası:", err);
  }
};

module.exports = {
  createLikeNotification,
  createCommentNotification,
  createBadgeNotification,
  createLevelUpNotification
};
