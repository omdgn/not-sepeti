const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllRead,
  deleteAllNotifications
} = require("../controllers/notification.controller");

// Tüm endpoint'ler authentication gerektirir
router.use(authMiddleware);

// 📄 Bildirimleri listele
router.get("/notifications", getNotifications);

// 🔢 Okunmamış sayısı
router.get("/notifications/unread-count", getUnreadCount);

// ✅ Okundu işaretle
router.patch("/notifications/:id/read", markAsRead);
router.patch("/notifications/read-all", markAllAsRead);

// 🗑️ Silme işlemleri
router.delete("/notifications/:id", deleteNotification);
router.delete("/notifications/read", deleteAllRead);
router.delete("/notifications/all", deleteAllNotifications);

module.exports = router;
