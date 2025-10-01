const multer = require('multer');

const fs = require('fs');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = '/tmp/note-kutusu/';

    // Klasör yoksa oluştur
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
      console.log('📁 Upload klasörü oluşturuldu:', uploadDir);
    }

    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Sadece PDF ve görsel dosyalar desteklenir'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fieldSize: 50 * 1024 * 1024, // Total 50MB limit
  }
});

module.exports = upload;