const mongoose = require("mongoose");

const ReactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  targetType: {
    type: String,
    enum: ["notes", "comments"],
    required: true
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  type: {
    type: String,
    enum: ["like", "dislike", "report"],
    required: true
  },
  description: {
    type: String,
    maxlength: 200
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// 🔒 Unique constraint: Bir kullanıcı aynı target'a sadece 1 reaction yapabilir
ReactionSchema.index({ userId: 1, targetType: 1, targetId: 1 }, { unique: true });

// 🚀 Performance indexes
ReactionSchema.index({ targetId: 1, targetType: 1, type: 1 }); // Counter sorguları için
ReactionSchema.index({ userId: 1 }); // User activity için
ReactionSchema.index({ targetId: 1, targetType: 1 }); // Genel sorgular için

module.exports = mongoose.model("Reaction", ReactionSchema, "Reaction");
