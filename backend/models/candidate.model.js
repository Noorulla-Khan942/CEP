import mongoose from 'mongoose';

const candidateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  position: { type: String, required: true },
  experience: { type: String, required: true },
  status: {
    type: String,
    enum: ['active', 'interview_scheduled', 'hired', 'rejected'],
    default: 'active'
  },
  assignedCompany: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true }, // Reference to Company
  interviewDate: { type: Date, required: true },
  skills: {
    type: [String],
    default: []
  },
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const Candidate = mongoose.model('Candidate', candidateSchema);

export default Candidate;
