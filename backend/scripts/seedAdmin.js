import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected for seeding');

    const email = process.argv[2];
    const password = process.argv[3];
    const name = process.argv[4] || 'Admin';

    if (!email || !password) {
      console.error('Usage: node scripts/seedAdmin.js <email> <password> [name]');
      process.exit(1);
    }

    if (password.length < 8) {
      console.error('Password must be at least 8 characters');
      process.exit(1);
    }

    const existing = await User.findOne({ email });
    if (existing) {
      console.error(`User with email ${email} already exists`);
      process.exit(1);
    }

    const admin = await User.create({
      name,
      email,
      password, // gets hashed automatically by the pre('save') hook on the model
      role: 'admin',
    });

    console.log(`Admin user created: ${admin.email} (role: ${admin.role})`);
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error.message);
    process.exit(1);
  }
};

seedAdmin();