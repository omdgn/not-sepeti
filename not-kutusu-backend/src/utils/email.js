const nodemailer = require("nodemailer");

// ✅ Transporter tanımı
const transporter = nodemailer.createTransport({
  service: "gmail", // Gmail SMTP
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  connectionTimeout: 60000, // 60 saniye
  greetingTimeout: 30000,   // 30 saniye
  socketTimeout: 60000,     // 60 saniye
});

// ✅ Bağlantı testi (başlangıçta 1 kez loglar)
console.log("🔍 Debug - NODE_ENV:", process.env.NODE_ENV);
console.log("🔍 Debug - EMAIL_USER:", process.env.EMAIL_USER ? "✅ Var" : "❌ Yok");
console.log("🔍 Debug - EMAIL_PASS:", process.env.EMAIL_PASS ? `✅ Var (${process.env.EMAIL_PASS.length} karakter)` : "❌ Yok");
console.log("🔍 Debug - FRONTEND_URL:", process.env.FRONTEND_URL || "❌ Yok");

transporter.verify(function (error, success) {
  if (error) {
    console.error("❌ Email transporter bağlantı hatası:", error.code || error.message);
    console.log("⚠️  Email servisi çalışmıyor ama sistem devam edecek.");
  } else {
    console.log("✅ Email servisine başarıyla bağlandı.");
  }
});

// ✅ Doğrulama maili gönderimi
const sendVerificationEmail = async (to, token) => {
  const url = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
  console.log("🔗 Doğrulama linki:", url);

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      replyTo: '"Not Kutusu" <notkutusuu@gmail.com>',
      to,
      subject: "E-posta Doğrulama",
      html: `
        <h2>Merhaba!</h2>
        <p>Not Kutusu hesabınızı doğrulamak için aşağıdaki linke tıklayın:</p>
        <a href="${url}">${url}</a>
        <p>Bu link 10 dakika geçerlidir.</p>
      `,
    });
    console.log("✅ Doğrulama maili gönderildi →", to);
  } catch (err) {
    console.error("❌ Doğrulama maili gönderme hatası:", err.code || err.message);
    console.log("⚠️  Email gönderilemedi ama kullanıcı kaydı başarılı. Link:", url);
    // Email gönderemese bile sistem crash etmesin
  }
};

// ✅ Şifre sıfırlama maili gönderimi
const sendResetPasswordEmail = async (to, token) => {
  const url = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
  console.log("🔗 Şifre sıfırlama linki:", url);

  try {
    await transporter.sendMail({
      from: `"Not Kutusu" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Şifre Sıfırlama Talebi",
      html: `
        <h2>Merhaba!</h2>
        <p>Şifrenizi sıfırlamak için aşağıdaki linke tıklayın:</p>
        <a href="${url}">${url}</a>
        <p>Bu bağlantı 1 saat geçerlidir.</p>
      `,
    });
    console.log("✅ Şifre sıfırlama maili gönderildi →", to);
  } catch (err) {
    console.error("❌ Şifre sıfırlama maili gönderme hatası:", err.code || err.message);
    console.log("⚠️  Email gönderilemedi ama işlem başarılı. Link:", url);
    // Email gönderemese bile sistem crash etmesin
  }
};


module.exports = { sendVerificationEmail, sendResetPasswordEmail };
