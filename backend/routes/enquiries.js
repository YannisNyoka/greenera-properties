import express from 'express';
import rateLimit from 'express-rate-limit';
import { createEnquiry, getEnquiries, updateEnquiryStatus } from '../controllers/enquiryController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

// generous but real limit — stops contact-form spam bots without blocking genuine visitors
const enquiryLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: { message: 'Too many enquiries submitted, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/', enquiryLimiter, createEnquiry);
router.get('/', protect, restrictTo('admin', 'editor'), getEnquiries);
router.put('/:id/status', protect, restrictTo('admin', 'editor'), updateEnquiryStatus);

export default router;