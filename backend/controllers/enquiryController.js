import Enquiry from '../models/Enquiry.js';
import { z } from 'zod';

const enquirySchema = z.object({
  property: z.string().optional(),
  name: z.string().min(1).max(100),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().min(1).max(2000),
  source: z.enum(['property-page', 'contact-page', 'agent-page']).optional(),
});

export const createEnquiry = async (req, res, next) => {
  try {
    const parsed = enquirySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: 'Invalid input', errors: parsed.error.flatten() });
    }

    const enquiry = await Enquiry.create(parsed.data);
    res.status(201).json({ message: 'Enquiry sent successfully', enquiry: { _id: enquiry._id } });
  } catch (error) {
    next(error);
  }
};

export const getEnquiries = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};

    const enquiries = await Enquiry.find(filter)
      .populate('property', 'title slug')
      .sort('-createdAt');

    res.json({ enquiries });
  } catch (error) {
    next(error);
  }
};

export const updateEnquiryStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['new', 'contacted', 'closed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const enquiry = await Enquiry.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!enquiry) {
      return res.status(404).json({ message: 'Enquiry not found' });
    }
    res.json({ enquiry });
  } catch (error) {
    next(error);
  }
};