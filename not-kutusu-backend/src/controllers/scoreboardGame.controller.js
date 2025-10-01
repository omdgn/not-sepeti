const User = require("../models/user.model");
const University = require("../models/university.model");
const { BADGES, LEVELS } = require("../config/badgesConfig");

// 🎮 Kullanıcı Gamification Bilgisi
const getUserGamification = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id)
      .select("name profilePic score monthlyScore level badges stats universityId")
      .populate("universityId", "name slug");

    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }

    // Rozet detaylarını ekle
    const badgeDetails = user.badges.map(badgeId => {
      const badge = Object.values(BADGES).find(b => b.id === badgeId);
      return badge || { id: badgeId, name: "Bilinmeyen", icon: "❓" };
    });

    // Seviye detayı
    const levelInfo = LEVELS[user.level];

    res.json({
      user: {
        id: user._id,
        name: user.name,
        profilePic: user.profilePic,
        university: user.universityId
      },
      gamification: {
        score: user.score,
        monthlyScore: user.monthlyScore,
        level: user.level,
        levelInfo: levelInfo,
        badges: badgeDetails,
        stats: user.stats,
        nextLevel: user.level < 6 ? LEVELS[user.level + 1] : null
      }
    });
  } catch (err) {
    console.error("getUserGamification error:", err);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};

// 🏅 Kullanıcının Rozetleri
const getUserBadges = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select("name badges stats");
    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }

    // Tüm rozetlerin durumu
    const allBadges = Object.values(BADGES).map(badge => ({
      ...badge,
      earned: user.badges.includes(badge.id),
      progress: badge.condition(user.stats) ? 100 : calculateBadgeProgress(badge, user.stats)
    }));

    res.json({
      userName: user.name,
      earnedCount: user.badges.length,
      totalCount: Object.keys(BADGES).length,
      badges: allBadges
    });
  } catch (err) {
    console.error("getUserBadges error:", err);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};

// Rozet ilerleme yüzdesi hesapla (basit versiyon)
const calculateBadgeProgress = (badge, stats) => {
  // FIRST_NOTE: notes >= 1
  if (badge.id === "first_note") {
    return Math.min(100, (stats.notes / 1) * 100);
  }
  // CONTRIBUTOR: notes >= 10
  if (badge.id === "contributor") {
    return Math.min(100, (stats.notes / 10) * 100);
  }
  // EXPERT: notes >= 30
  if (badge.id === "expert") {
    return Math.min(100, (stats.notes / 30) * 100);
  }
  // SOCIAL: comments >= 50
  if (badge.id === "social") {
    return Math.min(100, (stats.comments / 50) * 100);
  }
  // POPULAR: likesReceived >= 100
  if (badge.id === "popular") {
    return Math.min(100, (stats.likesReceived / 100) * 100);
  }
  // LEGEND: notes >= 100 && likesReceived >= 200
  if (badge.id === "legend") {
    const notesProgress = (stats.notes / 100) * 50;
    const likesProgress = (stats.likesReceived / 200) * 50;
    return Math.min(100, notesProgress + likesProgress);
  }

  return 0;
};

// 📊 Üniversite Aylık Liderlik Tablosu
const getUniversityMonthlyLeaderboard = async (req, res) => {
  try {
    const { slug } = req.params;
    const { limit = 50 } = req.query;

    const university = await University.findOne({ slug });
    if (!university) {
      return res.status(404).json({ message: "Üniversite bulunamadı" });
    }

    const leaderboard = await User.find({
      universityId: university._id,
      role: "user"
    })
      .select("name profilePic monthlyScore level badges")
      .sort({ monthlyScore: -1 })
      .limit(parseInt(limit));

    res.json({
      university: {
        name: university.name,
        slug: university.slug
      },
      period: "monthly",
      leaderboard: leaderboard.map((user, index) => ({
        rank: index + 1,
        user: {
          id: user._id,
          name: user.name,
          profilePic: user.profilePic,
          level: user.level,
          badgeCount: user.badges.length
        },
        score: user.monthlyScore
      }))
    });
  } catch (err) {
    console.error("getUniversityMonthlyLeaderboard error:", err);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};

// 🌍 Global Liderlik Tablosu
const getGlobalLeaderboard = async (req, res) => {
  try {
    const { limit = 50 } = req.query;

    const leaderboard = await User.find({ role: "user" })
      .select("name profilePic score level badges universityId")
      .populate("universityId", "name slug")
      .sort({ score: -1 })
      .limit(parseInt(limit));

    res.json({
      period: "all-time",
      leaderboard: leaderboard.map((user, index) => ({
        rank: index + 1,
        user: {
          id: user._id,
          name: user.name,
          profilePic: user.profilePic,
          level: user.level,
          badgeCount: user.badges.length,
          university: user.universityId
        },
        score: user.score
      }))
    });
  } catch (err) {
    console.error("getGlobalLeaderboard error:", err);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};

// 📈 Üniversite İstatistikleri
const getUniversityStats = async (req, res) => {
  try {
    const { slug } = req.params;

    const university = await University.findOne({ slug });
    if (!university) {
      return res.status(404).json({ message: "Üniversite bulunamadı" });
    }

    const [
      totalUsers,
      activeUsers,
      totalScore,
      averageLevel,
      topUser
    ] = await Promise.all([
      User.countDocuments({ universityId: university._id, role: "user" }),
      User.countDocuments({ universityId: university._id, role: "user", monthlyScore: { $gt: 0 } }),
      User.aggregate([
        { $match: { universityId: university._id, role: "user" } },
        { $group: { _id: null, total: { $sum: "$score" } } }
      ]).then(result => result[0]?.total || 0),
      User.aggregate([
        { $match: { universityId: university._id, role: "user" } },
        { $group: { _id: null, avg: { $avg: "$level" } } }
      ]).then(result => Math.round((result[0]?.avg || 1) * 10) / 10),
      User.findOne({ universityId: university._id, role: "user" })
        .select("name score level")
        .sort({ score: -1 })
    ]);

    res.json({
      university: {
        name: university.name,
        slug: university.slug
      },
      stats: {
        totalUsers,
        activeUsers,
        totalScore,
        averageLevel,
        topUser: topUser ? {
          name: topUser.name,
          score: topUser.score,
          level: topUser.level
        } : null
      }
    });
  } catch (err) {
    console.error("getUniversityStats error:", err);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};

module.exports = {
  getUserGamification,
  getUserBadges,
  getUniversityMonthlyLeaderboard,
  getGlobalLeaderboard,
  getUniversityStats
};
