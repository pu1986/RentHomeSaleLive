import nodemailer from "nodemailer";

export const sendVerificationMail = async (to, url, name) => {
  try {
    // 🔹 Debugging (sirf development ke liye)
    console.log("EMAIL_USER:", process.env.EMAIL_USER);
    console.log("EMAIL_PASS length:", process.env.EMAIL_PASS?.length);

    // 🔹 Mail transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // Gmail ID
        pass: process.env.EMAIL_PASS  // Gmail App Password (16 digit)
      }
    });

    // 🔹 Mail content
    const mailOptions = {
      from: `"Rent Home Sale Email Verification" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Verify your email",
      html: `
        <h3>Hi ${name},</h3>
        <p>Please verify your account by clicking the link below:</p>
        <a href="${url}" target="_blank">${url}</a>
        <br/><br/>
        <p>If you didn’t request this, you can ignore this email.</p>
      `
    };

    // 🔹 Send mail
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", info.messageId);

  } catch (err) {
    console.error("❌ Email send error:", err.message);
    throw err;
  }
};


export const sendMail = async (to, subject, html) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  await transporter.sendMail({
    from: `"Rent Home Sale" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html
  });
};
