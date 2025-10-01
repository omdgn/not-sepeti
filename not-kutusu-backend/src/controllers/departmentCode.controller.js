const DepartmentCode = require("../models/departmentCode.model");
const University = require("../models/university.model");

// 🎓 Slug ile ders kodlarını getir (token gerekli)
const getCodesBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const userUniversityId = req.user.universityId;

    const university = await University.findOne({ slug });
    if (!university) {
      return res.status(404).json({ message: "Üniversite bulunamadı." });
    }

    // Token'daki üniversite ile slug'daki üniversite uyuşmalı
    if (university._id.toString() !== userUniversityId.toString()) {
      return res.status(403).json({ message: "Bu üniversiteye erişim izniniz yok." });
    }

    const codes = await DepartmentCode.find({ universityId: university._id })
      .sort({ code: 1 })
      .select("code type createdAt");
    res.json({ codes });
  } catch (err) {
    console.error("getCodesBySlug hata:", err.message);
    res.status(500).json({ message: "Kodlar getirilemedi." });
  }
};

// ➕ Kod ekle (kullanıcı ve admin ekleyebilir)
const addDepartmentCode = async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ message: "Kod alanı zorunludur." });
    }

    const normalizedCode = code.trim().toUpperCase();

    const newCode = await DepartmentCode.create({
      code: normalizedCode,
      universityId: req.user.universityId,
      addedBy: req.user.userId
    });

    res.status(201).json({ message: "Kod başarıyla eklendi.", code: newCode });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "Bu kod zaten mevcut." });
    }
    console.error("Kod ekleme hatası:", err.message);
    res.status(500).json({ message: "Kod eklenemedi." });
  }
};

// 🟠 Tüm kodları listele (admin için)
const getAllDepartmentCodes = async (req, res) => {
  try {
    const codes = await DepartmentCode.find()
      .populate("universityId", "name slug")
      .populate("addedBy", "name email")
      .sort({ createdAt: -1 });

    res.json({ codes });
  } catch (err) {
    console.error("getAllDepartmentCodes hata:", err.message);
    res.status(500).json({ message: "Kodlar getirilemedi." });
  }
};

// 🛠️ Kod güncelle (admin için)
const updateDepartmentCode = async (req, res) => {
  try {
    const { id } = req.params;
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ message: "Yeni kod belirtilmelidir." });
    }

    const updated = await DepartmentCode.findByIdAndUpdate(
      id,
      { code: code.trim().toUpperCase() },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Kod bulunamadı." });
    }

    res.json({ message: "Kod güncellendi.", code: updated });
  } catch (err) {
    console.error("updateDepartmentCode hata:", err.message);
    res.status(500).json({ message: "Kod güncellenemedi." });
  }
};

// ❌ Kod sil (admin için)
const deleteDepartmentCode = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await DepartmentCode.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Kod bulunamadı." });
    }

    res.json({ message: "Kod silindi." });
  } catch (err) {
    console.error("deleteDepartmentCode hata:", err.message);
    res.status(500).json({ message: "Kod silinemedi." });
  }
};

module.exports = {
  getCodesBySlug,
  addDepartmentCode,
  getAllDepartmentCodes,
  updateDepartmentCode,
  deleteDepartmentCode
};
