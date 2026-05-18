// routes/upload.js - Image upload route for Cloudinary
const express = require('express');
const router = express.Router();
const { upload } = require('../config/cloudinary');

// POST /api/upload - Upload image to Cloudinary
router.post('/', (req, res) => {
  // Use multer to handle single file upload
  const uploadSingle = upload.single('image');
  
  uploadSingle(req, res, (err) => {
    if (err) {
      console.error('Upload error:', err);
      return res.status(400).json({ 
        success: false, 
        message: err.message || 'Image upload failed' 
      });
    }
    
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'No image file provided' 
      });
    }
    
    // Return the Cloudinary URL
    res.json({
      success: true,
      imageUrl: req.file.path,
      publicId: req.file.filename,
      message: 'Image uploaded successfully'
    });
  });
});

module.exports = router;