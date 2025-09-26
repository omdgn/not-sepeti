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

module.exports = mongoose.model("UserSuggestion", UserSuggestionSchema, "UserSuggestion");