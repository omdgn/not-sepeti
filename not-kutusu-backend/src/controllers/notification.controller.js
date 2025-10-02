const Notification = require("../models/notification.model");

// 📄 Bildirimleri Listele (Pagination)
const getNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const userId = req.user.userId;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const total = await Notification.countDocuments({ userId });
    const unreadCount = await Notification.countDocuments({ userId, isRead: false });

    const notifications = await Notification.find({ userId })
      .sort({ lastUpdated: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate("relatedNoteId", "title")
      .lean(); // Mongoose object olmadan döner, performans artışı

    res.json({
      notifications,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalNotifications: total,
        unreadCount,
        hasNextPage: skip + notifications.length < total
      }
    });
  } catch (err) {
    console.error("Bildirim listeleme hatası:", err);
    res.status(500).json({ message: "Bildirimler getirilemedi" });
  }
};

// 🔢 Okunmamış Sayısı
const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.userId;
    const count = await Notification.countDocuments({ userId, isRead: false });
    res.json({ unreadCount: count });
  } catch (err) {
    console.error("Unread count hatası:", err);
    res.status(500).json({ message: "Sayı getirilemedi" });
  }
};

// ✅ Tek Bildirimi Okundu İşaretle
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const notification = await Notification.findOneAndUpdate(
      { _id: id, userId }, // Güvenlik: Sadece kendi bildirimini güncelleyebilir
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "Bildirim bulunamadı" });
    }

    res.json({ message: "Okundu işaretlendi", notification });
  } catch (err) {
    console.error("Okundu işaretleme hatası:", err);
    res.status(500).json({ message: "İşlem başarısız" });
  }
};

// ✅✅ Tüm Bildirimleri Okundu İşaretle
const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.userId;

    const result = await Notification.updateMany(
      { userId, isRead: false },
      { isRead: true }
    );

    res.json({
      message: "Tüm bildirimler okundu işaretlendi",
      updatedCount: result.modifiedCount
    });
  } catch (err) {
    console.error("Toplu okundu işaretleme hatası:", err);
    res.status(500).json({ message: "İşlem başarısız" });
  }
};

// 🗑️ Tek Bildirimi Sil
const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const notification = await Notification.findOneAndDelete({
      _id: id,
      userId // Güvenlik: Sadece kendi bildirimini silebilir
    });

    if (!notification) {
      return res.status(404).json({ message: "Bildirim bulunamadı" });
    }

    res.json({ message: "Bildirim silindi" });
  } catch (err) {
    console.error("Bildirim silme hatası:", err);
    res.status(500).json({ message: "İşlem başarısız" });
  }
};

// 🗑️ Okunmuş Bildirimleri Sil
const deleteAllRead = async (req, res) => {
  try {
    const userId = req.user.userId;

    const result = await Notification.deleteMany({
      userId,
      isRead: true
    });

    res.json({
      message: "Okunmuş bildirimler silindi",
      deletedCount: result.deletedCount
    });
  } catch (err) {
    console.error("Okunmuş bildirimleri silme hatası:", err);
    res.status(500).json({ message: "İşlem başarısız" });
  }
};

// 🗑️🗑️ TÜM Bildirimleri Sil
const deleteAllNotifications = async (req, res) => {
  try {
    const userId = req.user.userId;

    const result = await Notification.deleteMany({ userId });

    res.json({
      message: "Tüm bildirimler silindi",
      deletedCount: result.deletedCount
    });
  } catch (err) {
    console.error("Tüm bildirimleri silme hatası:", err);
    res.status(500).json({ message: "İşlem başarısız" });
  }
};

module.exports = {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllRead,
  deleteAllNotifications
};
