import express from 'express';
import {
  getProperties,
  getPropertyBySlug,
  getSimilarProperties,
  getAllPropertiesAdmin,
  createProperty,
  updateProperty,
  deleteProperty,
} from '../controllers/propertyController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getProperties);
router.get('/:slug', getPropertyBySlug);
router.get('/:slug/similar', getSimilarProperties);

// Admin routes — protected
router.get('/admin/all', protect, restrictTo('admin', 'editor'), getAllPropertiesAdmin);
router.post('/', protect, restrictTo('admin', 'editor'), createProperty);
router.put('/:id', protect, restrictTo('admin', 'editor'), updateProperty);
router.delete('/:id', protect, restrictTo('admin'), deleteProperty); // delete restricted to admin only, not editors

export default router;