// backend/routes/userRoutes.js
import express from "express";
import { 
    changePassword, 
    getProfile, 
    updateProfile, 
    forgotPassword,  
    resetPassword 
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Profile info
router.get("/profile", protect, getProfile);

// Change password
router.post("/change-password", protect, changePassword);

// Update profile
router.put("/profile", protect, updateProfile);

// Forgot password
router.post("/forgot-password", forgotPassword);

// Reset password
router.post("/reset-password/:token", resetPassword);

export default router;
