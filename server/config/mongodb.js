// config/mongodb.js - MongoDB Atlas Connection
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Get connection string from environment variable
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    
    console.log(`✅ MongoDB Connected Successfully!`);
    console.log(`📦 Database Name: ${conn.connection.name}`);
    console.log(`📍 Host: ${conn.connection.host}`);
    
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1); // Stop server if connection fails
  }
};

module.exports = connectDB;