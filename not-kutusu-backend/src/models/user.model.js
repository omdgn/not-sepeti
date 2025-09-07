const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
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
  score: { type: Number, default: 0 },
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

  role: { type: String, enum: ["user", "admin"], default: "user" },

}, { timestamps: true });

UserSchema.index({ universityId: 1 });
UserSchema.index({ name: "text" });

module.exports = mongoose.model("User", UserSchema, "User");

