import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config(); // Load MONGO_URI and other env variables

// Define user schema inline
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: String
});

const User = mongoose.model('User', userSchema);

// Connect to MongoDB
const connectAndSeed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/cep');

    console.log('Connected to MongoDB');

    // Clear old users (optional)
    await User.deleteMany();

    // Seed users
    const users = [
      {
        name: 'Admin User',
        email: 'admin@cep.com',
        password: await bcrypt.hash('admin@123', 10),
        role: 'admin'
      },
      {
        name: 'John Recruiter',
        email: 'recruiter@cep.com',
        password: await bcrypt.hash('recruiter123', 10),
        role: 'recruiter'
      },
      {
        name: 'Tech Corp HR',
        email: 'hr@techcorp.com',
        password: await bcrypt.hash('hr@123', 10),
        role: 'company'
      },
      {
        name: 'Jane Candidate',
        email: 'candidate@email.com',
        password: await bcrypt.hash('123@sou', 10),
        role: 'candidate'
      }
    ];

    await User.insertMany(users);
    console.log('Users seeded successfully!');
    process.exit();
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

connectAndSeed();