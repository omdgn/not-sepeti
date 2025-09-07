require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/user.model");

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const password = process.env.DEFAULT_ADMIN_PASSWORD || "Admin123";
    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = new User({
      name: "Admin",
      email: "notkutusuu@gmail.com",
      password: hashedPassword,
      role: "admin",
      isVerified: true
    });

    await admin.save();
    console.log("✅ Admin başarıyla eklendi!");
    console.log("🔑 Kullanıcı bilgileri:");
    console.log(`📧 Email: ${admin.email}`);
    console.log(`🔐 Password: ${password}`);
    mongoose.connection.close();
  } catch (err) {
    console.error("❌ Admin eklenemedi:", err);
  }
};

createAdmin();
