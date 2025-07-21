const fs = require('fs');
const path = require('path');

class FileService {
  constructor() {
    this.uploadsDir = process.env.UPLOADS_DIR;
  }

  async saveFile(file) {
    const filePath = path.join(this.uploadsDir, file.filename);
    return {
      originalName: file.originalname,
      fileName: file.filename,
      path: filePath,
      size: file.size,
      mimeType: file.mimetype
    };
  }

  async deleteFile(fileName) {
    const filePath = path.join(this.uploadsDir, fileName);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  }

  getFileStream(fileName) {
    const filePath = path.join(this.uploadsDir, fileName);
    if (fs.existsSync(filePath)) {
      return fs.createReadStream(filePath);
    }
    return null;
  }
}

module.exports = new FileService();