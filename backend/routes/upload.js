import express from 'express';
import { getUploadSignature, deleteUploadedImage } from '../controllers/uploadController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

router.get('/signature', protect, restrictTo('admin', 'editor'), getUploadSignature);
router.post('/delete', protect, restrictTo('admin', 'editor'), deleteUploadedImage);

export default router;