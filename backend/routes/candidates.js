import express from 'express';
import Candidate from '../models/candidate.model.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';
import transporter from '../mailer.js';
import Company from '../models/company.model.js';
import { createEvent } from 'ics';

const router = express.Router();

// Get all candidates
router.get('/', authenticateToken, authorizeRoles(['admin', 'recruiter']), async (req, res) => {
  try {
    const candidates = await Candidate.find();
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// Get candidate by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) return res.status(404).json({ error: 'Candidate not found' });
    res.json(candidate);
  } catch (error) {
    res.status(400).json({ error: 'Invalid ID', details: error.message });
  }
});


router.post('/', authenticateToken, authorizeRoles(['admin', 'recruiter']), async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      position,
      experience,
      skills,
      assignedCompany, // this should be company _id
      interviewDate,
      status
    } = req.body;

    if (!name || !email || !phone || !position || !experience || !assignedCompany || !interviewDate) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Fetch company info from DB to get company email and name
    const company = await Company.findById(assignedCompany);
    if (!company) {
      return res.status(404).json({ error: 'Assigned company not found' });
    }

    const newCandidate = new Candidate({
      name,
      email: email.toLowerCase(),
      phone,
      position,
      experience,
      status: status || 'active',
      skills: Array.isArray(skills) ? skills : [],
      assignedCompany, // stored as ObjectId reference
      interviewDate,
      createdBy: req.user.userId
    });

    const savedCandidate = await newCandidate.save();

    // 1. Send onboarding email with login details
    const tempPassword = Math.random().toString(36).slice(-8);
    await transporter.sendMail({
      from: '"CEP Team" <soundarya0018@gmail.com>',
      to: savedCandidate.email,
      subject: `Candidate Interview platform`,
      html: `
        <h2>Welcome, ${savedCandidate.name}</h2>
        <p>Your candidate account has been created.</p>
        <p><strong>Email:</strong> ${savedCandidate.email}</p>
        <p><strong>Temporary Password:</strong> ${tempPassword}</p>
        <p>Please change your password after first login.</p>
        <p>Regards,<br/>CEP Team</p>
      `
    });

    // 2. Notify company and candidate about assignment
    await transporter.sendMail({
      from: '"CEP Team" <cep@gmail.com>',
      to: [savedCandidate.email, company.email],
      subject: `Candidate Assigned – ${savedCandidate.name}`,
      html: `
        <h2>Candidate Assigned</h2>
        <p><strong>${savedCandidate.name}</strong> has been assigned to <strong>${company.name}</strong>.</p>
        <p>Position: ${savedCandidate.position}</p>
        <p>Experience: ${savedCandidate.experience} years</p>
      `
    });

    // 3. Send Interview calendar invite to candidate
    const interviewDateObj = new Date(savedCandidate.interviewDate);
    const event = {
      start: [
        interviewDateObj.getFullYear(),
        interviewDateObj.getMonth() + 1,
        interviewDateObj.getDate(),
        10, 0 // Customize time if needed
      ],
      duration: { hours: 1 },
      title: `Interview - ${savedCandidate.position}`,
      description: `Interview scheduled at ${company.name}`,
      location: 'Zoom / Office (to be confirmed)',
      status: 'CONFIRMED',
      organizer: { name: 'CEP Team', email: 'cep@gmail.com' },
      attendees: [{ name: savedCandidate.name, email: savedCandidate.email }]
    };

    createEvent(event, async (err, value) => {
      if (err) {
        console.error('ICS generation error:', err);
        return;
      }

      await transporter.sendMail({
        from: '"CEP Team" <cep@gmail.com>',
        to: savedCandidate.email,
        subject: `Interview Scheduled – ${savedCandidate.position}`,
        html: `
          <h2>Interview Details</h2>
          <p>Hello ${savedCandidate.name},</p>
          <p>Your interview for the position of <strong>${savedCandidate.position}</strong> is scheduled.</p>
          <p><strong>Date:</strong> ${interviewDateObj.toDateString()}</p>
          <p><strong>Company:</strong> ${company.name}</p>
          <p>Please find the calendar invite attached.</p>
        `,
        icalEvent: {
          filename: 'interview.ics',
          method: 'REQUEST',
          content: value
        }
      });
    });

    res.status(201).json(savedCandidate);
  } catch (error) {
    console.error('Candidate creation error:', error);
    res.status(400).json({
      error: 'Failed to create candidate',
      details: error.message
    });
  }
});


// Update entire candidate
router.put('/:id', authenticateToken, authorizeRoles(['admin', 'recruiter']), async (req, res) => {
  try {
    const updatedCandidate = await Candidate.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!updatedCandidate) return res.status(404).json({ error: 'Candidate not found' });
    res.json(updatedCandidate);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update candidate', details: error.message });
  }
});

// Update only candidate status
router.patch('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ error: 'Status is required' });

    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) return res.status(404).json({ error: 'Candidate not found' });

    candidate.status = status;
    await candidate.save();
    res.json(candidate);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update status', details: error.message });
  }
});

// Delete candidate
router.delete('/:id', authenticateToken, authorizeRoles(['admin']), async (req, res) => {
  try {
    const deleted = await Candidate.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Candidate not found' });
    res.json({ message: 'Candidate deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete candidate', details: error.message });
  }
});

export default router;
