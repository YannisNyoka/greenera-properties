import mongoose from 'mongoose';

const enquirySchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: false, // allow general enquiries not tied to a specific listing
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    phone: {
      type: String,
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      maxlength: 2000,
    },
    status: {
      type: String,
      enum: ['new', 'contacted', 'closed'],
      default: 'new',
    },
    source: {
      type: String,
      enum: ['property-page', 'contact-page', 'agent-page'],
      default: 'contact-page',
    },
  },
  { timestamps: true }
);

enquirySchema.index({ status: 1, createdAt: -1 }); // for the admin inbox view, newest-first

export default mongoose.model('Enquiry', enquirySchema);