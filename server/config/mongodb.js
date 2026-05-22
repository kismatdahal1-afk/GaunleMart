// config/mongodb.js - MongoDB Atlas Connection (Fixed for newer Mongoose)
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    
    if (!uri) {
      console.error('❌ MONGODB_URI is not defined in environment variables');
      process.exit(1);
    }
    
    console.log('🔄 Connecting to MongoDB Atlas...');
    
    // REMOVED deprecated options - useNewUrlParser and useUnifiedTopology
    const conn = await mongoose.connect(uri);
    
    console.log(`✅ MongoDB Connected Successfully!`);
    console.log(`📦 Database Name: ${conn.connection.name}`);
    console.log(`📍 Host: ${conn.connection.host}`);
    
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;