// backend/routes/authRoutes.js
import express from 'express';
import { registerUser, loginUser, verifyEmail } from '../controllers/auth.js';

const router = express.Router();

// Register
router.post('/register', registerUser);

// Login
router.post('/login', loginUser);

// ✅ Verify email
router.get('/verify/:token', verifyEmail);


export default router;
