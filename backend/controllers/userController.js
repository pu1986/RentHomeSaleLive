import User from "../models/User.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";   // 🔹 Yaha import zaroori hai
import { sendMail } from "../utils/sendMail.js";


// 🔹 Change password
export const changePassword = async (req, res) => {
  try {
    const { old, newPass } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ message: "User not found" });

    // check old password
    const isMatch = await bcrypt.compare(old, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    // ❌ don't hash manually
    user.password = newPass;

    // ✅ pre('save') will automatically hash
    await user.save();

    res.json({ message: "✅ Password updated successfully" });
  } catch (err) {
    console.error("Password change error:", err);
    res.status(500).json({ message: "Server error while changing password" });
  }
};


// 🔹 Get profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// 🔹 Update profile (name, mobile)
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = req.body.name || user.name;
    user.mobile = req.body.mobile || user.mobile;

    const updatedUser = await user.save();

    res.json({
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      mobile: updatedUser.mobile,
      isAdmin: updatedUser.isAdmin,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// 🔹 Forgot password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // generate token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetExpire = Date.now() + 15 * 60 * 1000; // 15 min expire

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = resetExpire;
    await user.save();

    // link for frontend
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    await sendMail(
      user.email,
      "Password Reset Request",
      `
        <h3>Hi ${user.name},</h3>
        <p>You requested a password reset. Click the link below to reset:</p>
        <a href="${resetUrl}" target="_blank">${resetUrl}</a>
        <br/><br/>
        <p>If you did not request this, ignore this email.</p>
      `
    );

    res.json({ message: "Reset link sent to your email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


// 🔹 Reset password
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({ message: "Invalid or expired token" });

    // ✅ pre('save') middleware hash karega
    user.password = password;

    // clear token
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({ message: "Password reset successful. Please login." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
