const UserSuggestion = require("../models/userSuggestion.model");

// 🟢 Öneri oluşturma (kullanıcı)
const createSuggestion = async (req, res) => {
  try {
    const { title, content } = req.body;
    const userId = req.user._id || req.user.userId;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Başlık ve içerik zorunludur."
      });
    }

    const suggestion = new UserSuggestion({
      title,
      content,
      userId
    });

    await suggestion.save();

    await suggestion.populate('userId', 'name email');

    res.status(201).json({
      success: true,
      message: "Öneriniz başarıyla gönderildi.",
      data: suggestion
    });

  } catch (error) {
    console.error("Öneri oluşturma hatası:", error);
    res.status(500).json({
      success: false,
      message: "Sunucu hatası"
    });
  }
};

// 🟢 Kullanıcının kendi önerilerini getirme
const getMySuggestions = async (req, res) => {
  try {
    const userId = req.user._id || req.user.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const suggestions = await UserSuggestion.find({ userId })
      .populate('userId', 'name email')
      .populate('adminId', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await UserSuggestion.countDocuments({ userId });

    res.json({
      success: true,
      data: suggestions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error("Öneriler getirme hatası:", error);
    res.status(500).json({
      success: false,
      message: "Sunucu hatası"
    });
  }
};

// 🟢 Öneri detayını getirme (kullanıcı kendi önerisini)
const getSuggestionById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id || req.user.userId;

    const suggestion = await UserSuggestion.findOne({ _id: id, userId })
      .populate('userId', 'name email')
      .populate('adminId', 'name email');

    if (!suggestion) {
      return res.status(404).json({
        success: false,
        message: "Öneri bulunamadı."
      });
    }

    res.json({
      success: true,
      data: suggestion
    });

  } catch (error) {
    console.error("Öneri detay getirme hatası:", error);
    res.status(500).json({
      success: false,
      message: "Sunucu hatası"
    });
  }
};

// 🟢 Öneri güncelleme (kullanıcı sadece kendi önerisini günceller)
const updateSuggestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const userId = req.user._id || req.user.userId;

    const suggestion = await UserSuggestion.findOne({ _id: id, userId });

    if (!suggestion) {
      return res.status(404).json({
        success: false,
        message: "Öneri bulunamadı."
      });
    }

    // Sadece beklemede ve görüldü durumundaki öneriler güncellenebilir
    if (!["Beklemede", "Görüldü"].includes(suggestion.status)) {
      return res.status(400).json({
        success: false,
        message: "Bu durumdaki öneri güncellenemez."
      });
    }

    if (title) suggestion.title = title;
    if (content) suggestion.content = content;

    await suggestion.save();
    await suggestion.populate('userId', 'name email');
    await suggestion.populate('adminId', 'name email');

    res.json({
      success: true,
      message: "Öneri başarıyla güncellendi.",
      data: suggestion
    });

  } catch (error) {
    console.error("Öneri güncelleme hatası:", error);
    res.status(500).json({
      success: false,
      message: "Sunucu hatası"
    });
  }
};

// 🟢 Öneri silme (kullanıcı sadece kendi önerisini siler)
const deleteSuggestion = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id || req.user.userId;

    const suggestion = await UserSuggestion.findOne({ _id: id, userId });

    if (!suggestion) {
      return res.status(404).json({
        success: false,
        message: "Öneri bulunamadı."
      });
    }

    // Sadece beklemede ve görüldü durumundaki öneriler silinebilir
    if (!["Beklemede", "Görüldü"].includes(suggestion.status)) {
      return res.status(400).json({
        success: false,
        message: "Bu durumdaki öneri silinemez."
      });
    }

    await UserSuggestion.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Öneri başarıyla silindi."
    });

  } catch (error) {
    console.error("Öneri silme hatası:", error);
    res.status(500).json({
      success: false,
      message: "Sunucu hatası"
    });
  }
};


module.exports = {
  createSuggestion,
  getMySuggestions,
  getSuggestionById,
  updateSuggestion,
  deleteSuggestion
};