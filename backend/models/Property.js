import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['Point'],
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
    },
  },
  { _id: false }
);

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: 150,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: 5000,
    },
    propertyType: {
      type: String,
      required: true,
      enum: ['house', 'apartment', 'townhouse', 'vacant-land', 'commercial', 'industrial', 'farm'],
    },
    listingType: {
      type: String,
      required: true,
      enum: ['for-sale', 'to-let'],
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    bedrooms: { type: Number, min: 0, default: 0 },
    bathrooms: { type: Number, min: 0, default: 0 },
    parkingSpaces: { type: Number, min: 0, default: 0 },
    floorSize: { type: Number, min: 0 },
    erfSize: { type: Number, min: 0 },

    address: {
      street: { type: String, trim: true },
      suburb: { type: String, required: true, trim: true, index: true },
      city: { type: String, required: true, trim: true, index: true },
      province: { type: String, required: true, trim: true },
      postalCode: { type: String, trim: true },
    },

    location: {
      type: locationSchema,
      default: undefined,
    },

    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
        isPrimary: { type: Boolean, default: false },
      },
    ],

    agent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Agent',
      required: true,
    },

    status: {
      type: String,
      enum: ['active', 'pending', 'sold', 'let', 'draft'],
      default: 'draft',
    },
    featured: { type: Boolean, default: false },
    viewCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

propertySchema.index({ listingType: 1, propertyType: 1, status: 1 });
propertySchema.index({ price: 1 });
propertySchema.index({ location: '2dsphere' }, { sparse: true });
propertySchema.index({ title: 'text', description: 'text' });

export default mongoose.model('Property', propertySchema);