const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/house_rent';

  try {
    if (!process.env.MONGODB_URI) {
      console.warn('MONGODB_URI not set. Using local fallback mongodb://127.0.0.1:27017/house_rent');
    }

    await mongoose.connect(mongoUri);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    console.error('Tried Mongo URI:', mongoUri);
    process.exit(1);
  }
};

module.exports = connectDB;
