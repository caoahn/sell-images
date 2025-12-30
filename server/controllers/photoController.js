const { Photo, Event } = require('../models');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

exports.uploadPhotos = async (req, res) => {
  try {
    const { eventId, price } = req.body;
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const uploadedPhotos = [];

    // Ensure preview directory exists
    const previewDir = 'uploads/previews';
    if (!fs.existsSync(previewDir)) {
      fs.mkdirSync(previewDir, { recursive: true });
    }

    for (const file of files) {
      const originalPath = file.path;
      const filename = file.filename;
      const previewFilename = 'wm-' + filename;
      const previewPath = path.join(previewDir, previewFilename);

      // Process Watermark
      // Create a simple text watermark or overlay image. Here simple text via SVG overlay.
      const watermarkText = 'SCHOOL PHOTO - SAMPLE';
      const width = 800; // Resize width

      const svgImage = `
        <svg width="${width}" height="${width}">
          <style>
          .title { fill: rgba(255, 255, 255, 0.5); font-size: 50px; font-weight: bold;}
          </style>
          <text x="50%" y="50%" text-anchor="middle" class="title">${watermarkText}</text>
        </svg>
      `;
      const svgBuffer = Buffer.from(svgImage);

      await sharp(originalPath)
        .resize(width) // Resize for preview
        .composite([{ input: svgBuffer, gravity: 'center' }])
        .toFile(previewPath);

      // Save to DB
      const photo = await Photo.create({
        eventId,
        originalUrl: originalPath, // In real app, S3 key
        watermarkUrl: previewPath.replace(/\\/g, '/'), // Public URL path
        filename: file.originalname,
        price: price || 0,
      });

      uploadedPhotos.push(photo);
    }

    res.status(201).json({ message: 'Photos uploaded successfully', photos: uploadedPhotos });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.getGallery = async (req, res) => {
  try {
    const { eventId } = req.params;
    // Verify user has access to this event (check header or session if needed, for now logic is in Auth middleware or loose)
    // Here we assume public endpoint but usually protected by Token provided by 'access-event'

    const photos = await Photo.findAll({ where: { eventId } });
    res.json(photos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
