import express from 'express';
import rateLimit from 'express-rate-limit';
import { login, logout, getMe, register } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// throttle login attempts — 5 tries per 15 min per IP, blocks brute-force
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: 'Too many login attempts, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: 'Too many signup attempts, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/login', loginLimiter, login);
router.post('/register', registerLimiter, register);
router.post('/logout', logout);
router.get('/me', protect, getMe);

export default router;