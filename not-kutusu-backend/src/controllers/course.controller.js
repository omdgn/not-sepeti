const Course = require("../models/course.model");

// Yeni ders oluştur
const createCourse = async (req, res) => {
  try {
    const { code, name } = req.body;
    const universityId = req.user.universityId;

    if (!code || !name) {
      return res.status(400).json({ message: "Kod ve isim zorunludur." });
    }

    // Aynı üniversitede aynı kodlu ders var mı?
    const existing = await Course.findOne({ code, universityId });
    if (existing) {
      return res.status(400).json({ message: "Bu ders zaten kayıtlı." });
    }

    const newCourse = await Course.create({ code, name, universityId });
    res.status(201).json({ message: "Ders oluşturuldu", course: newCourse });
  } catch (err) {
    console.error("Ders ekleme hatası:", err);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};

// Tüm dersleri listele (genel erişim)
const getCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.json(courses);
  } catch (err) {
    console.error("Ders listeleme hatası:", err);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};

// Sadece giriş yapan kişinin üniversitesine ait dersleri getir
const getCoursesByUniversity = async (req, res) => {
  try {
    const universityId = req.user.universityId;
    const courses = await Course.find({ universityId }).sort({ createdAt: -1 });
    res.json(courses);
  } catch (err) {
    console.error("Uni’ye göre ders çekme hatası:", err);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};

const University = require("../models/university.model");

const getCoursesBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const userUniversityId = req.user.universityId;

    const university = await University.findOne({ slug });
    if (!university) {
      return res.status(404).json({ message: "Üniversite bulunamadı." });
    }

    // Token’daki üniversite ile route’daki slug uyuşuyor mu?
    if (university._id.toString() !== userUniversityId.toString()) {
      return res.status(403).json({ message: "Bu üniversiteye erişim izniniz yok." });
    }

    const courses = await Course.find({ universityId: university._id })
      .sort({ createdAt: -1 })
      .select("code name");
    res.json(courses);
  } catch (err) {
    console.error("Slug’a göre ders çekme hatası:", err);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};



module.exports = {
  createCourse,
  getCourses,
  getCoursesByUniversity,
  getCoursesBySlug,
};
