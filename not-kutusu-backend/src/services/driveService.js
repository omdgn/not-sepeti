const { google } = require('googleapis');
const fs = require('fs');
const { driveConfig } = require('../config/driveConfig');

const uploadToDrive = async (filePath, fileName) => {
  try {
    console.log("🔧 Drive OAuth2 client oluşturuluyor...");

    // OAuth2 setup
    const auth = new google.auth.OAuth2(
      driveConfig.clientId,
      driveConfig.clientSecret
    );
    auth.setCredentials({ refresh_token: driveConfig.refreshToken });

    // Drive API
    const drive = google.drive({ version: 'v3', auth });

    console.log(`📁 Drive'a yükleniyor: ${fileName}`);

    // Upload file
    const response = await drive.files.create({
      requestBody: {
        name: fileName
      },
      media: {
        body: fs.createReadStream(filePath)
      }
    });

    console.log(`✅ Dosya yüklendi, ID: ${response.data.id}`);

    // Make file public
    await drive.permissions.create({
      fileId: response.data.id,
      requestBody: {
        role: 'reader',
        type: 'anyone'
      }
    });

    const shareableUrl = `https://drive.google.com/file/d/${response.data.id}/view`;
    console.log(`🔗 Public link oluşturuldu: ${shareableUrl}`);

    return shareableUrl;

  } catch (error) {
    console.error("❌ Drive upload hatası:", error.message);
    throw new Error('Drive upload hatası: ' + error.message);
  }
};

module.exports = { uploadToDrive };