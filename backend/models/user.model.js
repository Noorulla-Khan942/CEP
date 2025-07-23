import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String, // Hashed password
  role: {
    type: String,
    enum: ['admin', 'recruiter', 'candidate', 'company'],
    default: 'candidate'
  }
});

export default mongoose.model('User', userSchema);
