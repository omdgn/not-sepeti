const cron = require("node-cron");
const User = require("../models/user.model");

/**
 * Aylık Puan Sıfırlama Cron Job
 * Her ayın 1'inde 00:00'da çalışır
 */
const startMonthlyResetJob = () => {
  // Her ayın 1'inde 00:00'da (UTC)
  cron.schedule("0 0 1 * *", async () => {
    try {
      console.log("🔄 [CRON] Aylık puan sıfırlama başladı...");

      const result = await User.updateMany(
        {},
        {
          monthlyScore: 0,
          lastMonthlyReset: new Date()
        }
      );

      console.log(`✅ [CRON] Aylık puanlar sıfırlandı. ${result.modifiedCount} kullanıcı güncellendi.`);
    } catch (error) {
      console.error("❌ [CRON] Aylık puan sıfırlama hatası:", error);
    }
  });

  console.log("✅ [CRON] Aylık puan sıfırlama job'u başlatıldı (Her ayın 1'i 00:00)");
};

module.exports = { startMonthlyResetJob };
