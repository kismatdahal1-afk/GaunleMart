// test-cloudinary.js - Test Cloudinary connection
require('dotenv').config();
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

console.log('Testing Cloudinary connection...');
console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);

// Try to get account usage (this will confirm connection)
cloudinary.api.ping((error, result) => {
  if (error) {
    console.error('❌ Cloudinary Connection Failed:', error.message);
  } else {
    console.log('✅ Cloudinary Connected Successfully!');
    console.log('📸 Image storage is ready!');
  }
});