const sharp = require('sharp');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
ffmpeg.setFfmpegPath('C:/ffmpeg/bin/ffmpeg.exe');
ffmpeg.setFfprobePath('C:/ffmpeg/bin/ffprobe.exe');

const unlinkAsync = promisify(fs.unlink);

const BASE_URL = 'http://localhost:5000';

const processImage = async (filePath, filename) => {
  const webpPath = path.join('uploads/images', filename.replace(path.extname(filename), '.webp'));
  await sharp(filePath)
    .webp({ quality: 80 })
    .toFile(webpPath);
  await unlinkAsync(filePath);
  return `${BASE_URL}/uploads/images/${path.basename(webpPath)}`;
};

const processVideo = async (filePath, filename) => {
  const thumbPath = path.join('uploads/videos/thumbnails', filename.replace(path.extname(filename), '.jpg'));

  return new Promise((resolve, reject) => {
    ffmpeg(filePath)
      .on('end', async () => {
        const videoUrl = `${BASE_URL}/uploads/videos/${filename}`;
        const thumbUrl = `${BASE_URL}/uploads/videos/thumbnails/${path.basename(thumbPath)}`;
        resolve({ videoUrl, thumbUrl });
      })
      .on('error', reject)
      .screenshots({
        count: 1,
        folder: 'uploads/videos/thumbnails',
        filename: path.basename(thumbPath),
        size: '640x360'
      });
  });
};

const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Không có file được upload!' });
    }

    const file = req.file;
    let result = {};

    if (file.mimetype.startsWith('image/')) {
      const imageUrl = await processImage(file.path, file.filename);
      result = { type: 'image', url: imageUrl };
    } else if (file.mimetype.startsWith('video/')) {
      const { videoUrl, thumbUrl } = await processVideo(file.path, file.filename);
      result = { type: 'video', videoUrl, thumbUrl };
    }

    res.json({
      message: 'Upload thành công!',
      data: result
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { uploadFile };