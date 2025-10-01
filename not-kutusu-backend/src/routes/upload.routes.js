const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const fileUpload = require('../middleware/fileUpload');
const { uploadFileToDrive } = require('../controllers/upload.controller');

// Drive'a dosya yükleme endpoint'i (tek veya çoklu dosya)
router.post('/upload-to-drive',
  authMiddleware,
  fileUpload.array('files'), // No file count limit
  uploadFileToDrive
);

module.exports = router;