const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ["like", "comment", "badge", "level_up"],
    required: true
  },

  // 📝 Not ile ilgili bildirimler için
  relatedNoteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Note"
  },

  // 💬 Yorum için son yorum metni (ilk 100 karakter)
  lastComment: {
    type: String,
    maxlength: 100
  },

  // 🏅 Rozet için
  badge: {
    id: String,
    name: String,
    icon: String
  },

  // 📈 Seviye için
  newLevel: {
    type: Number,
    min: 1,
    max: 6
  },

  // 🔢 Gruplama için (kaç kişi beğendi, kaç yorum yapıldı)
  count: {
    type: Number,
    default: 1,
    min: 1
  },

  // 👥 Son 3 kişi (beğeni/yorum yapan)
  lastActors: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    name: String
  }],

  // ✅ Okundu mu?
  isRead: {
    type: Boolean,
    default: false,
    index: true
  },

  // 🕐 Son güncelleme (aggregation için)
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Composite index (verimli sorgular için)
NotificationSchema.index({ userId: 1, isRead: 1, lastUpdated: -1 });
NotificationSchema.index({ userId: 1, type: 1, relatedNoteId: 1 }); // Upsert için

// 🗑️ TTL Index 1: Okunmuş bildirimler - 30 gün sonra otomatik sil
NotificationSchema.index(
  { lastUpdated: 1 },
  {
    expireAfterSeconds: 2592000, // 30 gün (30 * 24 * 60 * 60)
    partialFilterExpression: { isRead: true }
  }
);

// 🗑️ TTL Index 2: Okunmamış bildirimler - 30 gün sonra otomatik sil
// 30 gün login olmayan kullanıcı = inactive, bildirimleri temizlenir
NotificationSchema.index(
  { createdAt: 1 },
  {
    expireAfterSeconds: 2592000, // 30 gün (30 * 24 * 60 * 60)
    partialFilterExpression: { isRead: false }
  }
);

module.exports = mongoose.model("Notification", NotificationSchema, "Notification");
