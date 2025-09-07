const University = require("../models/university.model");

// Üniversiteleri listele (herkes erişebilir)
const getAllUniversities = async (req, res) => {
  try {
    const universities = await University.find();
    res.status(200).json({ universities });
  } catch (err) {
    res.status(500).json({ message: "Sunucu hatası", error: err.message });
  }
};

module.exports = {
  getAllUniversities
};
