import mongoose, { Schema } from 'mongoose';

export const userSchema = new Schema({
  name: String,
  email: String,
  avatar: String,
  githubId: String,
  githubAccessToken: String,
  createdAt: Date,
  updatedAt: Date,
});

export const queueSchema = new Schema({
  task_type: {
    type: String,
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed'],
    default: 'pending',
  },
  content: String,
  code: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});


export const User = mongoose.model('User', userSchema);
export const Queue = mongoose.model('Queue', queueSchema);
