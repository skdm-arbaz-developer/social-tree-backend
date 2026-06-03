import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User, ClientInfo } from '../models/index.js';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

// Nodemailer config using Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const user = await User.findOne({ 
      where: { username },
      include: [{ model: ClientInfo }]
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.is_active === false) {
      return res.status(403).json({ message: 'Account deactivated. Please contact an administrator.' });
    }

    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      return res.status(401).json({ message: 'Invalid Password' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: 86400 // 24 hours
    });

    res.status(200).json({
      id: user.id,
      name: user.name,
      username: user.username,
      role: user.role,
      unique_id: user.ClientInfo ? user.ClientInfo.unique_id : null,
      accessToken: token
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'No account found with that email' });
    }

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + 10); // 10 minutes expiry

    user.reset_otp = otp;
    user.reset_otp_expires = expires;
    await user.save();

    // Send email
    const mailOptions = {
      from: `"Social Tree Admin" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Password Reset OTP - Social Tree",
      text: `Your OTP for password reset is: ${otp}. It will expire in 10 minutes.`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #eaeaea; border-radius: 12px; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
          <div style="text-align: center; padding-bottom: 25px; border-bottom: 2px solid #f3e8ff;">
            <h2 style="color: #7e22ce; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">Social Tree</h2>
          </div>
          <div style="padding: 30px 0; color: #4a5568; line-height: 1.6; font-size: 16px;">
            <p style="margin-top: 0;">Hello <strong>${user.name || user.username}</strong>,</p>
            <p>We received a request to reset the password for your Social Tree Admin Portal account. Please use the following One-Time Password (OTP) to complete the process:</p>
            
            <div style="text-align: center; margin: 35px 0;">
              <span style="display: inline-block; font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #7e22ce; background-color: #faf5ff; padding: 15px 30px; border-radius: 12px; border: 2px dashed #e9d5ff;">
                ${otp}
              </span>
            </div>
            
            <p style="color: #718096; font-size: 14px; margin-bottom: 0;">This OTP is valid for <strong>10 minutes</strong>. If you did not request a password reset, please ignore this email or contact support if you have concerns.</p>
          </div>
          <div style="text-align: center; padding-top: 20px; border-top: 2px solid #f3e8ff; color: #a0aec0; font-size: 13px;">
            &copy; ${new Date().getFullYear()} Social Tree. All rights reserved.
          </div>
        </div>
      `
    };
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'OTP sent to your email successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) return res.status(404).json({ message: 'User not found' });
    
    if (user.reset_otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }
    
    if (new Date() > new Date(user.reset_otp_expires)) {
      return res.status(400).json({ message: 'OTP has expired' });
    }

    // Generate a temporary reset token (valid for 15 mins)
    const resetToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '15m' });

    res.status(200).json({ message: 'OTP verified successfully', resetToken });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;
    
    let decoded;
    try {
      decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: 'Invalid or expired reset token' });
    }

    const user = await User.findByPk(decoded.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    user.password = hashedPassword;
    user.reset_otp = null;
    user.reset_otp_expires = null;
    await user.save();

    res.status(200).json({ message: 'Password has been reset successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
