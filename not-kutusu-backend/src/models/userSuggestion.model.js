const mongoose = require("mongoose");

const UserSuggestionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  status: {
    type: String,
    enum: ["Beklemede", "Görüldü", "İnceleniyor", "Eklendi", "Eklenmedi"],
    default: "Beklemede"
  },
  adminNotes: {
    type: String,
    maxlength: 500
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
}, { timestamps: true });

UserSuggestionSchema.index({ userId: 1 });
UserSuggestionSchema.index({ status: 1 });
UserSuggestionSchema.index({ createdAt: -1 });
UserSuggestionSchema.index({
  title: "text",
  content: "text"
});

// 🗑️ TTL Index: Kapanmış önerileri otomatik sil
// "Eklendi" veya "Eklenmedi" statusundaki öneriler 15 gün sonra silinir
UserSuggestionSchema.index(
  { createdAt: 1 },
  {
    expireAfterSeconds: 1296000, // 15 gün (15 * 24 * 60 * 60)
    partialFilterExpression: {
      status: { $in: ["Eklendi", "Eklenmedi"] }
    }
  }
);

module.exports = mongoose.model("UserSuggestion", UserSuggestionSchema, "UserSuggestion");