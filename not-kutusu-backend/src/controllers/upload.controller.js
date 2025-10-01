const { uploadToDrive } = require('../services/driveService');
const { createZipFromFiles } = require('../utils/zipUtils');
const fs = require('fs');

const uploadFileToDrive = async (req, res) => {
  console.log("🚀 Upload controller çağrıldı");
  const tempFiles = []; // Cleanup için dosya listesi

  try {
    // Çoklu dosya kontrolü
    const files = req.files || (req.file ? [req.file] : []);

    if (files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'En az bir dosya seçmelisiniz'
      });
    }

    console.log(`📁 Upload isteği alındı: ${files.length} dosya`);

    // Temp dosyalarını kaydet (cleanup için)
    tempFiles.push(...files.map(f => f.path));

    let finalFilePath, finalFileName;

    if (files.length === 1) {
      // Tek dosya bile olsa ZIP yap
      console.log('📦 Tek dosya ZIP\'leniyor...');
      finalFilePath = await createZipFromFiles(files);
      finalFileName = `dosyalar-${Date.now()}.zip`;
      tempFiles.push(finalFilePath); // ZIP'i de cleanup listesine ekle
    } else {
      // Çoklu dosya ZIP yap
      console.log(`📦 ${files.length} dosya ZIP\'leniyor...`);
      finalFilePath = await createZipFromFiles(files);
      finalFileName = `dosyalar-${Date.now()}.zip`;
      tempFiles.push(finalFilePath); // ZIP'i de cleanup listesine ekle
    }

    // Drive'a yükle
    const driveUrl = await uploadToDrive(finalFilePath, finalFileName);

    // Tüm temp dosyaları sil
    tempFiles.forEach(filePath => {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`🗑️  Temp dosya silindi: ${filePath}`);
      }
    });

    res.json({
      success: true,
      url: driveUrl,
      fileName: finalFileName,
      fileCount: files.length,
      message: `${files.length} dosya başarıyla ZIP'lenerek Drive'a yüklendi`
    });

  } catch (error) {
    console.error('❌ Upload controller hatası:', error);

    // Hata durumunda tüm temp dosyaları temizle
    tempFiles.forEach(filePath => {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`🗑️  Hata sonrası temp dosya silindi: ${filePath}`);
      }
    });

    res.status(500).json({
      success: false,
      message: 'Dosya yükleme hatası: ' + error.message
    });
  }
};

module.exports = { uploadFileToDrive };