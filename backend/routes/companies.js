import express from 'express';
import Company from '../models/company.model.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// Get all companies
router.get('/', authenticateToken, authorizeRoles(['admin', 'recruiter']), async (req, res) => {
  try {
    const companies = await Company.find();
    res.json(companies);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch companies' });
  }
});

// Get company by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }
    res.json(company);
  } catch (err) {
    res.status(500).json({ error: 'Error retrieving company' });
  }
});

// Create new company
router.post('/', authenticateToken, authorizeRoles(['admin', 'recruiter']), async (req, res) => {
  try {
    const { name, industry, location, website, poc_name, poc_email, poc_phone } = req.body;

    const newCompany = new Company({
      name,
      industry,
      location,
      website,
      poc_name,
      poc_email,
      poc_phone,
      active: true
    });

    await newCompany.save();
    res.status(201).json(newCompany);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create company', details: err.message });
  }
});

// Update company
router.put('/:id', authenticateToken, authorizeRoles(['admin', 'recruiter']), async (req, res) => {
  try {
    const updatedCompany = await Company.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!updatedCompany) {
      return res.status(404).json({ error: 'Company not found' });
    }
    res.json(updatedCompany);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update company', details: err.message });
  }
});

// Delete company
router.delete('/:id', authenticateToken, authorizeRoles(['admin']), async (req, res) => {
  try {
    const deletedCompany = await Company.findByIdAndDelete(req.params.id);
    if (!deletedCompany) {
      return res.status(404).json({ error: 'Company not found' });
    }
    res.json({ message: 'Company deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete company' });
  }
});

export default router;
