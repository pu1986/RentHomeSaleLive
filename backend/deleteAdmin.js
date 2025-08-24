import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import connectDB from './config/db.js';

dotenv.config();
await connectDB();

await User.deleteOne({ email: 'admin@example.com' });
console.log('Admin deleted successfully');

process.exit();
