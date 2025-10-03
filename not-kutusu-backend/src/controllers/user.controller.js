const User = require("../models/user.model");
const University = require("../models/university.model");
const Note = require("../models/note.model");
const Comment = require("../models/comment.model");

// 🧑‍🎓 Kullanıcı Profilini Getir
const getUserProfile = async (req, res) => {
  try {
    const { slug, id } = req.params;
    const userUniversityId = req.user.universityId;

    const university = await University.findOne({ slug });
    if (!university) return res.status(404).json({ message: "Üniversite bulunamadı." });
    if (university._id.toString() !== userUniversityId.toString()) {
      return res.status(403).json({ message: "Bu üniversiteye erişim izniniz yok." });
    }

    const user = await User.findById(id).select(
      "name profilePic score aboutMe department socialLinks notifications universityId"
    );
    if (!user) return res.status(404).json({ message: "Kullanıcı bulunamadı." });
    if (user.universityId.toString() !== university._id.toString()) {
      return res.status(403).json({ message: "Bu kullanıcıya erişim yetkiniz yok." });
    }

    const noteCount = await Note.countDocuments({ createdBy: id });
    const commentCount = await Comment.countDocuments({ userId: id });
    const noteStats = await Note.aggregate([
      { $match: { createdBy: user._id } },
      {
        $group: {
          _id: null,
          totalLikes: { $sum: "$likes" },
          totalDislikes: { $sum: "$dislikes" },
          totalReports: { $sum: "$reports" }
        }
      }
    ]);
    const stats = noteStats[0] || { totalLikes: 0, totalDislikes: 0, totalReports: 0 };

    res.json({
      name: user.name,
      profilePic: user.profilePic,
      score: user.score,
      aboutMe: user.aboutMe,
      department: user.department,
      socialLinks: user.socialLinks,
      notifications: user.notifications,
      noteCount,
      commentCount,
      totalLikes: stats.totalLikes,
      totalDislikes: stats.totalDislikes,
      totalReports: stats.totalReports
    });
  } catch (err) {
    console.error("Kullanıcı profili hatası:", err);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};


// const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;

// console.log(passwordRegex.test("abc"));         // ❌ false (çok kısa + büyük harf yok + rakam yok)
// console.log(passwordRegex.test("abcdef"));      // ❌ false (büyük harf yok + rakam yok)
// console.log(passwordRegex.test("abcdef1"));     // ❌ false (büyük harf yok)
// console.log(passwordRegex.test("ABCDEF1"));     // ❌ false (küçük harf yok)
// console.log(passwordRegex.test("Abcdef"));      // ❌ false (rakam yok)
// console.log(passwordRegex.test("Abcdef1"));     // ✅ true (6+ karakter, küçük + büyük harf + rakam var)
// console.log(passwordRegex.test("YeniSifre123")); // ✅ true


const bcrypt = require("bcryptjs");

// 🔄 Kullanıcı Profilini Güncelle (sadece kendisi)
const updateUserProfile = async (req, res) => {
  try {
    const { slug, id } = req.params;
    const { 
      name, 
      profilePic, 
      aboutMe, 
      department, 
      socialLinks, 
      notifications, 
      oldPassword, 
      newPassword, 
      confirmPassword 
    } = req.body;

    const userUniversityId = req.user.universityId;
    const userId = req.user.userId;

    const university = await University.findOne({ slug });
    if (!university) return res.status(404).json({ message: "Üniversite bulunamadı." });
    if (university._id.toString() !== userUniversityId.toString()) {
      return res.status(403).json({ message: "Bu üniversiteye erişim izniniz yok." });
    }
    if (userId !== id) {
      return res.status(403).json({ message: "Sadece kendi profilinizi güncelleyebilirsiniz." });
    }

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "Kullanıcı bulunamadı." });

    const updateData = { name, profilePic, aboutMe, department, socialLinks, notifications };

    // 🔑 Şifre güncelleme isteği varsa
    if (newPassword) {
      if (!oldPassword) {
        return res.status(400).json({ message: "Eski şifre gereklidir." });
      }

      // Eski şifreyi doğrula
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(403).json({ message: "Eski şifre yanlış." });
      }

      // Yeni şifre kuralları (Türkçe karakterler dahil)
      const passwordRegex = /^(?=.*[a-zçğıöşü])(?=.*[A-ZÇĞİÖŞÜ])(?=.*\d).{6,}$/;
      if (!passwordRegex.test(newPassword)) {
        return res.status(400).json({
          message: "Yeni şifre en az 6 karakter olmalı, 1 büyük harf, 1 küçük harf ve 1 rakam içermelidir."
        });
      }

      // Confirm şifre kontrolü
      if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: "Yeni şifreler eşleşmiyor." });
      }

      // Yeni şifreyi hashle
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      updateData.password = hashedPassword;
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select("name profilePic score aboutMe department socialLinks notifications");

    res.json({ message: "Profil güncellendi", user: updatedUser });
  } catch (err) {
    console.error("Profil güncelleme hatası:", err);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};




// 📄 Kullanıcının kendi notları
const getUserNotes = async (req, res) => {
  try {
    const { slug, id } = req.params;
    const userUniversityId = req.user.universityId;

    const university = await University.findOne({ slug });
    if (!university) return res.status(404).json({ message: "Üniversite bulunamadı." });
    if (university._id.toString() !== userUniversityId.toString()) {
      return res.status(403).json({ message: "Bu üniversiteye erişim izniniz yok." });
    }

    const notes = await Note.find({ createdBy: id, universityId: university._id })
      .populate("courseId", "code name")
      .sort({ createdAt: -1 });

    res.json({ notes });
  } catch (err) {
    console.error("Kullanıcı notları hatası:", err);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};

// 💬 Kullanıcının kendi yorumları
const getUserComments = async (req, res) => {
  try {
    const { slug, id } = req.params;
    const userUniversityId = req.user.universityId;

    const university = await University.findOne({ slug });
    if (!university) return res.status(404).json({ message: "Üniversite bulunamadı." });
    if (university._id.toString() !== userUniversityId.toString()) {
      return res.status(403).json({ message: "Bu üniversiteye erişim izniniz yok." });
    }

    const comments = await Comment.find({ userId: id })
      .populate("noteId", "title")
      .sort({ createdAt: -1 });

    res.json({ comments });
  } catch (err) {
    console.error("Kullanıcı yorumları hatası:", err);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  getUserNotes,
  getUserComments
};
