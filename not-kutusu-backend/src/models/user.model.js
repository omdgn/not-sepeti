const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true,},
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  universityId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "University", 
    required: function() { 
      return this.role !== "admin"; 
    } 
  },
  
  profilePic: { type: String }, // Profil fotoğrafı URL'si

  // 🎮 Gamification
  score: { type: Number, default: 0, min: 0 },
  monthlyScore: { type: Number, default: 0, min: 0 },
  level: { type: Number, default: 1, min: 1, max: 6 },
  badges: [{ type: String }],
  stats: {
    notes: { type: Number, default: 0, min: 0 },
    comments: { type: Number, default: 0, min: 0 },
    likesReceived: { type: Number, default: 0, min: 0 }
  },
  lastMonthlyReset: { type: Date, default: Date.now },

  aboutMe: { type: String }, // 🆕 Hakkında
  department: { type: String }, // 🆕 Bölüm
  socialLinks: {                // 🆕 Sosyal linkler
    linkedin: { type: String },
    github: { type: String }
  },
  notifications: { type: Boolean, default: true }, // 🆕 Bildirim tercihi

  // 🆕 Email doğrulama için
  isVerified: { type: Boolean, default: false },
  verificationToken: { type: String },
  verificationExpires: { type: Date },

  // 🆕 Ban / pasif hesap için
  isActive: { type: Boolean, default: true },

  // 🆕 Şifre sıfırlama için
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },

  // 🔒 Token versiyonu - şifre değiştiğinde artırılır
  tokenVersion: { type: Number, default: 0 },

  // 📅 Son giriş tarihi
  lastLogin: { type: Date },

  role: { type: String, enum: ["user", "admin"], default: "user" },

}, { timestamps: true });

UserSchema.index({ universityId: 1 });
UserSchema.index({ name: "text" });
UserSchema.index({ score: -1 });
UserSchema.index({ monthlyScore: -1 });
UserSchema.index({ universityId: 1, monthlyScore: -1 });
UserSchema.index({ level: -1 });

module.exports = mongoose.model("User", UserSchema, "User");

