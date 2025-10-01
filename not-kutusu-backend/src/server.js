require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");
const { startMonthlyResetJob } = require("./jobs/monthlyReset");

const PORT = process.env.PORT || 5050;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);

    // Aylık puan sıfırlama cron job'unu başlat
    startMonthlyResetJob();
  });
});
