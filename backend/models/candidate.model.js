import mongoose from 'mongoose';

const candidateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },

  position: { type: String, required: true },
  experience: { type: String, required: true },

  status: {
    type: String,
    enum: [
      'application_sent',
      'shortlisted',
      'interview_scheduled',
      'offer',
      'joined',
      'hired',
      'rejected',
      'active'
    ],
    default: 'application_sent',
  },

  role: {
    type: String,
    enum: ['candidate'],
    default: 'candidate',
  },

  assignedCompany: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: false, // make optional to allow creation before assignment
  },

  interviewDate: {
    type: Date,
  },

  skills: {
    type: [String],
    default: [],
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Candidate = mongoose.model('Candidate', candidateSchema);

export default Candidate;