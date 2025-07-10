import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import Interview from '../models/interview.model.js';
import Company from '../models/company.model.js';
import Candidate from '../models/candidate.model.js';

const router = express.Router();

// ✅ Get all interviews (with optional filters)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { status, date } = req.query;
    let query = {};

    if (status) query.status = status;
    if (date) query.date = date;

    const interviews = await Interview.find(query);
    res.json(interviews);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ Get interview by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);
    if (!interview) {
      return res.status(404).json({ error: 'Interview not found' });
    }
    res.json(interview);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ Create new interview (with candidate/company name lookup)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      candidateId,
      companyId,
      position,
      date,
      time,
      type,
      interviewer,
      status
    } = req.body;

    // Validate required fields
    if (!candidateId || !companyId || !position || !date || !time || !type || !interviewer) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Fetch candidate and company
    const candidate = await Candidate.findById(candidateId);
    const company = await Company.findById(companyId);

    if (!candidate || !company) {
      return res.status(404).json({ error: 'Candidate or Company not found' });
    }

    const newInterview = new Interview({
      candidateId,
      candidateName: candidate.name,
      companyId,
      companyName: company.name,
      position,
      date,
      time,
      type,
      interviewer,
      status: status || 'Scheduled'  // ⬅️ Default if not provided
    });

    const savedInterview = await newInterview.save();
    res.status(201).json(savedInterview);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not create interview', details: err.message });
  }
});

// ✅ Update full interview
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const updatedInterview = await Interview.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedInterview) {
      return res.status(404).json({ error: 'Interview not found' });
    }

    res.json(updatedInterview);
  } catch (err) {
    res.status(500).json({ error: 'Could not update interview' });
  }
});

// ✅ Update interview status only
router.patch('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;

    const interview = await Interview.findById(req.params.id);
    if (!interview) {
      return res.status(404).json({ error: 'Interview not found' });
    }

    interview.status = status;
    await interview.save();
    res.json(interview);
  } catch (err) {
    res.status(500).json({ error: 'Could not update status' });
  }
});

// ✅ Delete interview
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const deletedInterview = await Interview.findByIdAndDelete(req.params.id);
    if (!deletedInterview) {
      return res.status(404).json({ error: 'Interview not found' });
    }
    res.json({ message: 'Interview deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Could not delete interview' });
  }
});

export default router;
