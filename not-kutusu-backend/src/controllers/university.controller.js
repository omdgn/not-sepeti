const University = require("../models/university.model");
const User = require("../models/user.model");
const Note = require("../models/note.model");

// Üniversiteleri listele (herkes erişebilir)
const getAllUniversities = async (req, res) => {
  try {
    const universities = await University.find();
    res.status(200).json({ universities });
  } catch (err) {
    res.status(500).json({ message: "Sunucu hatası", error: err.message });
  }
};

// Global istatistikler (herkes erişebilir)
const getGlobalStats = async (req, res) => {
  try {
    const [universityCount, userCount, noteCount] = await Promise.all([
      University.countDocuments(),
      User.countDocuments(),
      Note.countDocuments()
    ]);

    res.status(200).json({
      universityCount,
      userCount,
      noteCount
    });
  } catch (err) {
    res.status(500).json({ message: "Sunucu hatası", error: err.message });
  }
};

// Üniversiteye özgü istatistikler (slug bazlı)
const getUniversityStats = async (req, res) => {
  try {
    const { slug } = req.params;

    const university = await University.findOne({ slug });
    if (!university) {
      return res.status(404).json({ message: "Üniversite bulunamadı" });
    }

    const [userCount, noteCount] = await Promise.all([
      User.countDocuments({ universityId: university._id }),
      Note.countDocuments({ universityId: university._id })
    ]);

    res.status(200).json({
      university: {
        name: university.name,
        slug: university.slug
      },
      userCount,
      noteCount
    });
  } catch (err) {
    res.status(500).json({ message: "Sunucu hatası", error: err.message });
  }
};

module.exports = {
  getAllUniversities,
  getGlobalStats,
  getUniversityStats
};
