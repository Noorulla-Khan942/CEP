import mongoose from 'mongoose';

const interviewSchema = new mongoose.Schema({
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Candidate',
    required: true
  },
  candidateName: {
    type: String,
    required: true
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  companyName: {
    type: String,
    required: true
  },
  position: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['Technical', 'HR Round', 'Managerial', 'Other'],
    required: true
  },
  status: {
  type: String,
  enum: ['scheduled', 'completed', 'cancelled', 'rescheduled'],
  default: 'scheduled'
},
  interviewer: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true,
    index: true
  }
});

const Interview = mongoose.model('Interview', interviewSchema);

export default Interview;
