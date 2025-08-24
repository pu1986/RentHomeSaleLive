// backend/controllers/auth.js
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { sendVerificationMail } from '../utils/sendMail.js';

// 🔑 JWT generate function
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// 🟢 Register user
export const registerUser = async (req, res) => {
  try {
    const { name, email, mobile, password, isAdmin } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    // generate email verification token
    const verificationToken = crypto.randomBytes(20).toString('hex');

    const user = await User.create({
      name,
      email,
      mobile,
      password,
      verificationToken,
      isVerified: false,
      isAdmin: !!isAdmin   // ✅ ensure admin flag works
    });

    // verification URL (frontend)
    const verifyUrl = `${process.env.FRONTEND_URL}/verify/${verificationToken}`;
    await sendVerificationMail(user.email, verifyUrl, user.name);

    res.status(201).json({
      message: '✅ Registered successfully! Please check your email (inbox/spam) to verify your account.',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// 🟢 Verify email
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const user = await User.findOne({ verificationToken: token });

    if (!user) return res.status(400).json({ message: 'Invalid or expired verification link' });

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.json({ message: '🎉 Email verified successfully! You can now login.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🟢 Login user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    if (!user.isVerified) {
      return res.status(401).json({ message: '⚠️ Please verify your email before logging in.' });
    }

    res.json({
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        isAdmin: user.isAdmin,     // ✅ Admin info send
        isVerified: user.isVerified
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
