const archiver = require('archiver');
const fs = require('fs');
const path = require('path');

const createZipFromFiles = async (files) => {
  return new Promise((resolve, reject) => {
    const timestamp = Date.now();
    const zipPath = `/tmp/note-kutusu/archive-${timestamp}.zip`;

    // ZIP dosyası için write stream oluştur
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', {
      zlib: { level: 9 } // En yüksek sıkıştırma
    });

    console.log(`📦 ZIP oluşturuluyor: ${files.length} dosya`);

    // Error handling
    output.on('close', () => {
      console.log(`✅ ZIP oluşturuldu: ${archive.pointer()} bytes`);
      resolve(zipPath);
    });

    archive.on('error', (err) => {
      console.error('❌ ZIP oluşturma hatası:', err);
      reject(err);
    });

    // ZIP stream'i output'a bağla
    archive.pipe(output);

    // Dosyaları ZIP'e ekle
    files.forEach((file, index) => {
      const fileName = `${index + 1}-${file.originalname}`;
      archive.file(file.path, { name: fileName });
      console.log(`📄 ZIP'e eklendi: ${fileName}`);
    });

    // ZIP'i sonlandır
    archive.finalize();
  });
};

module.exports = { createZipFromFiles };