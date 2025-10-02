const User = require("../models/user.model");
const { BADGES, LEVELS, POINTS } = require("../config/badgesConfig");

/**
 * Puan ekle
 * @param {String} userId - Kullanıcı ID
 * @param {Number} points - Eklenecek puan
 * @param {String} reason - Puan ekleme sebebi (loglama için)
 */
const addPoints = async (userId, points, reason = "") => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      console.error(`❌ [GAMIFICATION] User not found: ${userId}`);
      return null;
    }

    const oldLevel = user.level;

    // Puanları ekle
    user.score = Math.max(0, user.score + points);
    user.monthlyScore = Math.max(0, user.monthlyScore + points);

    // Seviye hesapla
    user.level = calculateLevel(user.score);

    await user.save();
    console.log(`✅ [GAMIFICATION] ${user.name} +${points} puan (${reason})`);

    // 📢 Seviye atladıysa bildirim gönder
    if (user.level > oldLevel) {
      const notificationService = require("./notificationService");
      const levelName = LEVELS[user.level].name;
      await notificationService.createLevelUpNotification(userId, user.level, levelName, global.io);
    }

    return user;
  } catch (error) {
    console.error(`❌ [GAMIFICATION] addPoints error:`, error);
    return null;
  }
};

/**
 * Puan çıkar
 * @param {String} userId - Kullanıcı ID
 * @param {Number} points - Çıkarılacak puan
 * @param {String} reason - Puan çıkarma sebebi
 */
const removePoints = async (userId, points, reason = "") => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      console.error(`❌ [GAMIFICATION] User not found: ${userId}`);
      return null;
    }

    // Puanları çıkar (negatif olmaz)
    user.score = Math.max(0, user.score - points);
    // monthlyScore'dan çıkarmıyoruz (aylık reset var)

    // Seviye yeniden hesapla
    user.level = calculateLevel(user.score);

    await user.save();
    console.log(`✅ [GAMIFICATION] ${user.name} -${points} puan (${reason})`);

    return user;
  } catch (error) {
    console.error(`❌ [GAMIFICATION] removePoints error:`, error);
    return null;
  }
};

/**
 * İstatistikleri güncelle
 * @param {String} userId - Kullanıcı ID
 * @param {String} field - Güncellenecek alan (notes, comments, likesReceived)
 * @param {Number} increment - Artış/azalış miktarı
 */
const updateStats = async (userId, field, increment) => {
  try {
    const validFields = ["notes", "comments", "likesReceived"];
    if (!validFields.includes(field)) {
      console.error(`❌ [GAMIFICATION] Invalid field: ${field}`);
      return null;
    }

    const user = await User.findById(userId);
    if (!user) {
      console.error(`❌ [GAMIFICATION] User not found: ${userId}`);
      return null;
    }

    // İstatistiği güncelle (negatif olmaz)
    user.stats[field] = Math.max(0, user.stats[field] + increment);

    await user.save();
    console.log(`✅ [GAMIFICATION] ${user.name} stats.${field} ${increment > 0 ? '+' : ''}${increment}`);

    return user;
  } catch (error) {
    console.error(`❌ [GAMIFICATION] updateStats error:`, error);
    return null;
  }
};

/**
 * Rozet kontrolü ve ödüllendirme
 * @param {String} userId - Kullanıcı ID
 */
const checkAndAwardBadges = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) return null;

    const awardedBadges = [];

    // Her rozeti kontrol et
    for (const badge of Object.values(BADGES)) {
      // Zaten varsa geç
      if (user.badges.includes(badge.id)) continue;

      // Koşulu kontrol et
      if (badge.condition(user.stats)) {
        user.badges.push(badge.id);
        awardedBadges.push(badge);
        console.log(`🏅 [GAMIFICATION] ${user.name} yeni rozet kazandı: ${badge.name}`);
      }
    }

    if (awardedBadges.length > 0) {
      await user.save();

      // 📢 Her yeni rozet için bildirim gönder
      const notificationService = require("./notificationService");
      // io'yu almak için global app instance gerekebilir, şimdilik null
      for (const badgeId of awardedBadges) {
        const badge = BADGES[badgeId];
        await notificationService.createBadgeNotification(userId, badge, global.io);
      }
    }

    return awardedBadges;
  } catch (error) {
    console.error(`❌ [GAMIFICATION] checkAndAwardBadges error:`, error);
    return [];
  }
};

/**
 * Puana göre seviye hesapla
 * @param {Number} score - Kullanıcının puanı
 * @returns {Number} Seviye (1-6)
 */
const calculateLevel = (score) => {
  for (let level = 6; level >= 1; level--) {
    if (score >= LEVELS[level].minScore) {
      return level;
    }
  }
  return 1;
};

/**
 * Not yükleme hook'u
 * @param {String} userId - Kullanıcı ID
 */
const onNoteUpload = async (userId) => {
  try {
    await addPoints(userId, POINTS.NOTE_UPLOAD, "note_upload");
    await updateStats(userId, "notes", 1);
    await checkAndAwardBadges(userId);
  } catch (error) {
    console.error(`❌ [GAMIFICATION] onNoteUpload error:`, error);
  }
};

/**
 * Not silme hook'u
 * @param {String} userId - Kullanıcı ID
 */
const onNoteDelete = async (userId) => {
  try {
    await removePoints(userId, Math.abs(POINTS.NOTE_DELETE), "note_delete");
    await updateStats(userId, "notes", -1);
  } catch (error) {
    console.error(`❌ [GAMIFICATION] onNoteDelete error:`, error);
  }
};

/**
 * Yorum ekleme hook'u
 * @param {String} userId - Kullanıcı ID
 */
const onCommentPost = async (userId) => {
  try {
    await addPoints(userId, POINTS.COMMENT_POST, "comment_post");
    await updateStats(userId, "comments", 1);
    await checkAndAwardBadges(userId);
  } catch (error) {
    console.error(`❌ [GAMIFICATION] onCommentPost error:`, error);
  }
};

/**
 * Yorum silme hook'u
 * @param {String} userId - Kullanıcı ID
 */
const onCommentDelete = async (userId) => {
  try {
    await removePoints(userId, Math.abs(POINTS.COMMENT_DELETE), "comment_delete");
    await updateStats(userId, "comments", -1);
  } catch (error) {
    console.error(`❌ [GAMIFICATION] onCommentDelete error:`, error);
  }
};

/**
 * Like alma hook'u
 * @param {String} userId - Not sahibi ID
 */
const onLikeReceived = async (userId) => {
  try {
    await addPoints(userId, POINTS.LIKE_RECEIVED, "like_received");
    await updateStats(userId, "likesReceived", 1);
    await checkAndAwardBadges(userId);
  } catch (error) {
    console.error(`❌ [GAMIFICATION] onLikeReceived error:`, error);
  }
};

/**
 * Like kaldırma hook'u
 * @param {String} userId - Not sahibi ID
 */
const onLikeRemoved = async (userId) => {
  try {
    await removePoints(userId, Math.abs(POINTS.LIKE_REMOVED), "like_removed");
    await updateStats(userId, "likesReceived", -1);
  } catch (error) {
    console.error(`❌ [GAMIFICATION] onLikeRemoved error:`, error);
  }
};

module.exports = {
  addPoints,
  removePoints,
  updateStats,
  checkAndAwardBadges,
  calculateLevel,
  onNoteUpload,
  onNoteDelete,
  onCommentPost,
  onCommentDelete,
  onLikeReceived,
  onLikeRemoved
};
