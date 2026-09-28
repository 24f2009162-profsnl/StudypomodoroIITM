import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'node:dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);
dotenv.config();

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error('MONGO_URI is missing. Add it to backend/.env');
  }

  mongoose.set('strictQuery', true);

  await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 10000,
  });

  console.log('Connected to MongoDB');
};

export default connectDB;
