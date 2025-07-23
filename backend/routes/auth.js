// routes/auth.js
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import Otp from '../models/otp.model.js';
import transporter from '../mailer.js'; 
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign(
    { userId: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'your-secret',
    { expiresIn: '1h' }
  );

  const { password: _, ...safeUser } = user.toObject();
  res.json({ token, user: safeUser });
});

// GET /api/auth/me
router.get('/me', authenticateToken, async (req, res) => {
  const user = await User.findById(req.user.userId).select('-password');
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

// POST /api/auth/send-otp
router.post('/send-otp', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: 'User not found' });

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  await Otp.findOneAndUpdate({ email }, { code, expiresAt }, { upsert: true });

  await transporter.sendMail({
    to: email,
    from: 'CEP Team <cep@gmail.com>',
    subject: 'Password Reset OTP',
    html: `<p>Your OTP is <strong>${code}</strong>. It expires in 10 minutes.</p>`
  });

  res.json({ message: 'OTP sent' });
});

// POST /api/auth/reset-password
router.post('/reset-password', async (req, res) => {
  const { email, otp, newPassword } = req.body;

  const record = await Otp.findOne({ email });
  if (!record || record.code !== otp || record.expiresAt < new Date()) {
    return res.status(400).json({ error: 'Invalid or expired OTP' });
  }

  const hashed = await bcrypt.hash(newPassword, 10);
  await User.findOneAndUpdate({ email }, { password: hashed });
  await Otp.deleteOne({ email });

  res.json({ message: 'Password updated successfully' });
});

export default router;
