import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

export const connection = await mongoose.connect(MONGODB_URI);