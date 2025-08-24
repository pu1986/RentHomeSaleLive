import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  mobile: { type: String },  // optional rakha, taaki sab users ko force na kare
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },

  // ✅ Email verification fields
  isVerified: { type: Boolean, default: false },
  verificationToken: { type: String },
  // ✅ Forgot password fields
  resetPasswordToken: { type: String },
  resetPasswordExpire: { type: Date }
}, { timestamps: true });

// Password hash karne se pehle
userSchema.pre('save', async function(next){
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Password match check karne ka method
userSchema.methods.matchPassword = async function(entered){
  return await bcrypt.compare(entered, this.password);
};

export default mongoose.model('User', userSchema);
