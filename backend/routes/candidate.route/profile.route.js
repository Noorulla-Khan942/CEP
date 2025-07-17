// backend/routes/profile.route.js
import express from 'express';
import Candidate from '../../models/candidate.model.js';
import authMiddleware from '../auth.js'; 

const router = express.Router();

// GET /api/profile/me - fetch candidate's own profile
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.user.id)
      .select('-__v')
      .populate('assignedCompany', 'name')     // only show company name
      .populate('createdBy', 'name email role'); // who created this candidate (optional)

    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    res.json(candidate);
  } catch (err) {
    console.error('[Profile Route Error]', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router;
