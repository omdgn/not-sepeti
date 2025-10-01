// 🏅 Rozet Tanımları

const BADGES = {
  FIRST_NOTE: {
    id: "first_note",
    name: "İlk Adım",
    icon: "🌱",
    description: "İlk notunu yükle",
    condition: (stats) => stats.notes >= 1
  },

  CONTRIBUTOR: {
    id: "contributor",
    name: "Katkıcı",
    icon: "📚",
    description: "10 not yükle",
    condition: (stats) => stats.notes >= 10
  },

  EXPERT: {
    id: "expert",
    name: "Uzman",
    icon: "🎓",
    description: "30 not yükle",
    condition: (stats) => stats.notes >= 30
  },

  SOCIAL: {
    id: "social",
    name: "Sosyal",
    icon: "💬",
    description: "50 yorum yap",
    condition: (stats) => stats.comments >= 50
  },

  POPULAR: {
    id: "popular",
    name: "Popüler",
    icon: "⭐",
    description: "100 like al",
    condition: (stats) => stats.likesReceived >= 100
  },

  LEGEND: {
    id: "legend",
    name: "Efsane",
    icon: "👑",
    description: "100 not yükle ve 200 like al",
    condition: (stats) => stats.notes >= 100 && stats.likesReceived >= 200
  }
};

// Seviye Tanımları
const LEVELS = {
  1: { name: "Acemi", minScore: 0, maxScore: 100 },
  2: { name: "Öğrenci", minScore: 101, maxScore: 300 },
  3: { name: "Aktif Katkıcı", minScore: 301, maxScore: 600 },
  4: { name: "Uzman", minScore: 601, maxScore: 1000 },
  5: { name: "Profesyonel", minScore: 1001, maxScore: 1500 },
  6: { name: "Efsane", minScore: 1501, maxScore: Infinity }
};

// Puan Değerleri
const POINTS = {
  NOTE_UPLOAD: 20,
  NOTE_DELETE: -20,
  COMMENT_POST: 2,
  COMMENT_DELETE: -2,
  LIKE_RECEIVED: 1,
  LIKE_REMOVED: -1
};

module.exports = {
  BADGES,
  LEVELS,
  POINTS
};
