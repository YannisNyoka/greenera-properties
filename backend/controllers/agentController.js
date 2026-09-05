import Agent from '../models/Agent.js';
import { z } from 'zod';

const agentSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  phone: z.string().min(1),
  bio: z.string().max(2000).optional(),
  title: z.string().optional(),
  active: z.boolean().optional(),
  photo: z
    .object({
      url: z.string().url(),
      publicId: z.string().min(1),
    })
    .optional(),
});

export const getAgents = async (req, res, next) => {
  try {
    const agents = await Agent.find({ active: true }).sort('name');
    res.json({ agents });
  } catch (error) {
    next(error);
  }
};

export const getAgentById = async (req, res, next) => {
  try {
    const agent = await Agent.findOne({ _id: req.params.id, active: true });
    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }
    res.json({ agent });
  } catch (error) {
    next(error);
  }
};

export const getAllAgentsAdmin = async (req, res, next) => {
  try {
    const agents = await Agent.find().sort('name');
    res.json({ agents });
  } catch (error) {
    next(error);
  }
};

export const createAgent = async (req, res, next) => {
  try {
    const parsed = agentSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: 'Invalid input', errors: parsed.error.flatten() });
    }

    const existing = await Agent.findOne({ email: parsed.data.email });
    if (existing) {
      return res.status(409).json({ message: 'An agent with this email already exists' });
    }

    const agent = await Agent.create(parsed.data);
    res.status(201).json({ agent });
  } catch (error) {
    next(error);
  }
};

export const updateAgent = async (req, res, next) => {
  try {
    const parsed = agentSchema.partial().safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: 'Invalid input', errors: parsed.error.flatten() });
    }

    const agent = await Agent.findByIdAndUpdate(req.params.id, parsed.data, {
      new: true,
      runValidators: true,
    });

    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }
    res.json({ agent });
  } catch (error) {
    next(error);
  }
};

export const deleteAgent = async (req, res, next) => {
  try {
    const Property = (await import('../models/Property.js')).default;
    const listingCount = await Property.countDocuments({ agent: req.params.id });

    if (listingCount > 0) {
      return res.status(409).json({
        message: `Cannot delete — this agent has ${listingCount} active listing(s). Reassign them first.`,
      });
    }

    const agent = await Agent.findByIdAndDelete(req.params.id);
    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }
    res.json({ message: 'Agent deleted' });
  } catch (error) {
    next(error);
  }
};