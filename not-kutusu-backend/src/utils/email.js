const nodemailer = require("nodemailer");
const sgMail = require('@sendgrid/mail');

// ✅ Email servis konfigürasyonu
const initEmailService = () => {
  if (process.env.NODE_ENV === 'production' && process.env.SENDGRID_API_KEY) {
    // Production'da SendGrid kullan
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    console.log("🔧 SendGrid API aktif edildi");
    return 'sendgrid';
  } else {
    // Development'ta Gmail SMTP kullan
    console.log("🔧 Gmail SMTP aktif edildi");
    return 'gmail';
  }
};

const emailService = initEmailService();

// Gmail için transporter
const gmailTransporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  connectionTimeout: 60000,
  greetingTimeout: 30000,
  socketTimeout: 60000,
  tls: {
    rejectUnauthorized: false
  }
});

// ✅ Debug bilgileri
console.log("🔍 Debug - NODE_ENV:", process.env.NODE_ENV);
console.log("🔍 Debug - EMAIL_SERVICE:", emailService);
console.log("🔍 Debug - EMAIL_USER:", process.env.EMAIL_USER ? "✅ Var" : "❌ Yok");
console.log("🔍 Debug - SENDGRID_API_KEY:", process.env.SENDGRID_API_KEY ? "✅ Var" : "❌ Yok");
console.log("🔍 Debug - FRONTEND_URL:", process.env.FRONTEND_URL || "❌ Yok");

// Gmail bağlantı testi (sadece development'ta)
if (emailService === 'gmail') {
  gmailTransporter.verify(function (error) {
    if (error) {
      console.error("❌ Gmail SMTP bağlantı hatası:", error.code || error.message);
      console.log("⚠️  Gmail servisi çalışmıyor ama sistem devam edecek.");
    } else {
      console.log("✅ Gmail SMTP servisine başarıyla bağlandı.");
    }
  });
}

// ✅ Email gönderme fonksiyonu (SendGrid veya Gmail)
const sendEmail = async (mailOptions) => {
  if (emailService === 'sendgrid') {
    // SendGrid kullan
    const msg = {
      to: mailOptions.to,
      from: process.env.EMAIL_USER, // Gmail adresinizi kullan
      subject: mailOptions.subject,
      html: mailOptions.html,
    };

    try {
      await sgMail.send(msg);
      console.log("✅ SendGrid ile email gönderildi →", mailOptions.to);
    } catch (error) {
      console.error("❌ SendGrid email hatası:", error.message);
      throw error;
    }
  } else {
    // Gmail SMTP kullan
    try {
      await gmailTransporter.sendMail({
        from: process.env.EMAIL_USER,
        replyTo: '"Not Kutusu" <notkutusuu@gmail.com>',
        ...mailOptions
      });
      console.log("✅ Gmail SMTP ile email gönderildi →", mailOptions.to);
    } catch (error) {
      console.error("❌ Gmail SMTP email hatası:", error.message);
      throw error;
    }
  }
};

// ✅ Doğrulama maili gönderimi
const sendVerificationEmail = async (to, token) => {
  const url = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
  console.log("🔗 Doğrulama linki:", url);

  try {
    await sendEmail({
      to,
      subject: "E-posta Doğrulama",
      html: `
        <h2>Merhaba!</h2>
        <p>Not Kutusu hesabınızı doğrulamak için aşağıdaki linke tıklayın:</p>
        <a href="${url}">${url}</a>
        <p>Bu link 10 dakika geçerlidir.</p>
      `,
    });
  } catch (err) {
    console.error("❌ Doğrulama maili gönderme hatası:", err.code || err.message);
    console.log("⚠️  Email gönderilemedi ama kullanıcı kaydı başarılı. Link:", url);
  }
};

// ✅ Şifre sıfırlama maili gönderimi
const sendResetPasswordEmail = async (to, token) => {
  const url = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
  console.log("🔗 Şifre sıfırlama linki:", url);

  try {
    await sendEmail({
      to,
      subject: "Şifre Sıfırlama Talebi",
      html: `
        <h2>Merhaba!</h2>
        <p>Şifrenizi sıfırlamak için aşağıdaki linke tıklayın:</p>
        <a href="${url}">${url}</a>
        <p>Bu bağlantı 1 saat geçerlidir.</p>
      `,
    });
  } catch (err) {
    console.error("❌ Şifre sıfırlama maili gönderme hatası:", err.code || err.message);
    console.log("⚠️  Email gönderilemedi ama işlem başarılı. Link:", url);
  }
};


module.exports = { sendVerificationEmail, sendResetPasswordEmail };
