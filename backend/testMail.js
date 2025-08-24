import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

console.log("USER:", process.env.EMAIL_USER);
console.log("PASS length:", process.env.EMAIL_PASS?.length);

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const send = async () => {
  try {
    const info = await transporter.sendMail({
      from: `"Test" <${process.env.EMAIL_USER}>`,
      to: "upadhayay.pankaj1986@gmail.com",
      subject: "Hello",
      text: "Test mail",
    });
    console.log("✅ Sent:", info.messageId);
  } catch (e) {
    console.error("❌ Error:", e);
  }
};
send();
