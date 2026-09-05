import express from 'express';
import {
  getAgents,
  getAgentById,
  getAllAgentsAdmin,
  createAgent,
  updateAgent,
  deleteAgent,
} from '../controllers/agentController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAgents);
router.get('/admin/all', protect, restrictTo('admin', 'editor'), getAllAgentsAdmin);
router.get('/:id', getAgentById);

router.post('/', protect, restrictTo('admin', 'editor'), createAgent);
router.put('/:id', protect, restrictTo('admin', 'editor'), updateAgent);
router.delete('/:id', protect, restrictTo('admin'), deleteAgent);

export default router;