import Property from '../models/Property.js';
import { z } from 'zod';

const imageSchema = z.object({
  url: z.string().url(),
  publicId: z.string().min(1),
  isPrimary: z.boolean().optional(),
});

const propertySchema = z.object({
  title: z.string().min(1).max(150),
  description: z.string().min(1).max(5000),
  propertyType: z.enum(['house', 'apartment', 'townhouse', 'vacant-land', 'commercial', 'industrial', 'farm']),
  listingType: z.enum(['for-sale', 'to-let']),
  price: z.number().min(0),
  bedrooms: z.number().min(0).optional(),
  bathrooms: z.number().min(0).optional(),
  parkingSpaces: z.number().min(0).optional(),
  floorSize: z.number().min(0).optional(),
  erfSize: z.number().min(0).optional(),
  address: z.object({
    street: z.string().optional(),
    suburb: z.string().min(1),
    city: z.string().min(1),
    province: z.string().min(1),
    postalCode: z.string().optional(),
  }),
  agent: z.string().min(1),
  status: z.enum(['active', 'pending', 'sold', 'let', 'draft']).optional(),
  featured: z.boolean().optional(),
  images: z.array(imageSchema).optional(),
  location: z
    .object({
      type: z.literal('Point').optional(),
      coordinates: z.tuple([z.number(), z.number()]).optional(),
    })
    .optional(),
});

const slugify = (title) =>
  title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .concat('-', Date.now().toString(36));

export const getProperties = async (req, res, next) => {
  try {
    const {
      listingType,
      propertyType,
      city,
      suburb,
      minPrice,
      maxPrice,
      bedrooms,
      agent,
      featured,
      page = 1,
      limit = 12,
      sort = '-createdAt',
    } = req.query;

    const filter = { status: 'active' };

    if (listingType) filter.listingType = listingType;
    if (propertyType) filter.propertyType = propertyType;
    if (city) filter['address.city'] = new RegExp(city, 'i');
    if (suburb) filter['address.suburb'] = new RegExp(suburb, 'i');
    if (bedrooms) filter.bedrooms = { $gte: Number(bedrooms) };
    if (agent) filter.agent = agent;
    if (featured === 'true') filter.featured = true;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(50, Math.max(1, Number(limit)));

    const [properties, total] = await Promise.all([
      Property.find(filter)
        .populate('agent', 'name email phone photo')
        .sort(sort)
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      Property.countDocuments(filter),
    ]);

    res.json({
      properties,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getPropertyBySlug = async (req, res, next) => {
  try {
    const property = await Property.findOneAndUpdate(
      { slug: req.params.slug, status: 'active' },
      { $inc: { viewCount: 1 } },
      { new: true }
    ).populate('agent', 'name email phone photo title');

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    res.json({ property });
  } catch (error) {
    next(error);
  }
};

export const getSimilarProperties = async (req, res, next) => {
  try {
    const current = await Property.findOne({ slug: req.params.slug, status: 'active' });
    if (!current) {
      return res.status(404).json({ message: 'Property not found' });
    }

    const similar = await Property.find({
      _id: { $ne: current._id },
      status: 'active',
      listingType: current.listingType,
      $or: [
        { 'address.suburb': current.address.suburb },
        { 'address.city': current.address.city, propertyType: current.propertyType },
      ],
    })
      .populate('agent', 'name email phone photo')
      .limit(4)
      .sort('-createdAt');

    res.json({ properties: similar });
  } catch (error) {
    next(error);
  }
};

export const getAllPropertiesAdmin = async (req, res, next) => {
  try {
    const properties = await Property.find()
      .populate('agent', 'name email')
      .sort('-createdAt');
    res.json({ properties });
  } catch (error) {
    next(error);
  }
};

export const createProperty = async (req, res, next) => {
  try {
    const parsed = propertySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: 'Invalid input', errors: parsed.error.flatten() });
    }

    const property = await Property.create({
      ...parsed.data,
      slug: slugify(parsed.data.title),
    });

    res.status(201).json({ property });
  } catch (error) {
    next(error);
  }
};

export const updateProperty = async (req, res, next) => {
  try {
    const parsed = propertySchema.partial().safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: 'Invalid input', errors: parsed.error.flatten() });
    }

    const property = await Property.findByIdAndUpdate(req.params.id, parsed.data, {
      new: true,
      runValidators: true,
    });

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    res.json({ property });
  } catch (error) {
    next(error);
  }
};

export const deleteProperty = async (req, res, next) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    res.json({ message: 'Property deleted' });
  } catch (error) {
    next(error);
  }
};