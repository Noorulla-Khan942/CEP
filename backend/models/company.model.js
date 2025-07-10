import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  industry: {
    type: String,
    required: true
  },
  location: {
    type: String
  },
  website: {
    type: String
  },
  poc_name: {
    type: String,
    required: true
  },
  poc_email: {
    type: String,
    required: true
  },
  poc_phone: {
    type: String,
    required: true
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true // adds createdAt and updatedAt
});

const Company = mongoose.model('Company', companySchema);
export default Company;
