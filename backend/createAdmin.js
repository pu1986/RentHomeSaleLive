import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import connectDB from './config/db.js';

dotenv.config();
await connectDB();

const resetOrCreateAdmin = async () => {
  try {
    const email = 'renthomesale9@gmail.com'; // admin email
    const password = 'rentHomeSale@dmin#123'; // plain password
    const mobile = '8080107500'; // 👈 yaha koi valid mobile daal do

    let admin = await User.findOne({ email });

    if (admin) {
      // Agar admin already hai to password reset kar do
      admin.password = password;
      admin.mobile = mobile;
      await admin.save();
      console.log('🔑 Admin password reset successfully');
    } else {
      // Naya admin create karo
      await User.create({
        name: 'Admin',
        email,
        password,
        mobile,  // 👈 yaha ab mobile add kiya
        isAdmin: true
      });
      console.log('✅ Admin user created successfully');
    }

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

resetOrCreateAdmin();
