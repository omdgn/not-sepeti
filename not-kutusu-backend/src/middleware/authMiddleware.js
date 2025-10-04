const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Yetkisiz erişim: Token eksik." });
  }

  const token = authHeader.split(" ")[1];
  try {
    // Token çöz
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Kullanıcıyı DB'den çek
    const user = await User.findById(decoded.userId).select("_id universityId role isActive tokenVersion");
    if (!user) {
      return res.status(401).json({ message: "Geçersiz kullanıcı." });
    }

    // Token versiyonu kontrolü - şifre değiştiğinde eski token'lar geçersiz olur
    if (decoded.tokenVersion !== user.tokenVersion) {
      return res.status(401).json({ message: "Token geçersiz. Lütfen tekrar giriş yapın." });
    }

    // Kullanıcı pasifse (banlanmış)
    if (user.isActive === false) {
      return res.status(403).json({ message: "Hesabınız pasif durumdadır." });
    }

    // request içine kullanıcı bilgilerini ekle
    req.user = {
      userId: user._id.toString(),
      universityId: user.universityId ? user.universityId.toString() : null,
      role: user.role
    };

    next();
  } catch (err) {
    console.error("authMiddleware error:", err);
    return res.status(403).json({ message: "Geçersiz veya süresi dolmuş token." });
  }
};

module.exports = authMiddleware;
