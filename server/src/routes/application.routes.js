const express = require('express');
const Application = require('../models/application.model');
const auth = require('../middleware/auth.middleware');
const User = require('../models/user.model');

const router = express.Router();

router.post('/', auth(['student']), async (req, res) => {
  try {
    const { scholarshipId, status } = req.body;
    const application = await Application.create({
      studentId: req.user.id,
      scholarshipId,
      status
    });
    res.status(201).json(application);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/me', auth(['student']), async (req, res) => {
  try {
    const applications = await Application.find({ studentId: req.user.id }).populate(
      'scholarshipId'
    );
    res.json(applications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/', auth(['collegeAdmin', 'admin']), async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) {
      filter.status = req.query.status;
    }

    if (req.user.role === 'collegeAdmin') {
      const collegeAdmin = await User.findById(req.user.id).select('collegeName collegeCode');
      if (!collegeAdmin) {
        return res.status(404).json({ message: 'User not found' });
      }

      const students = await User.find({
        role: 'student',
        $or: [{ collegeName: collegeAdmin.collegeName }, { collegeCode: collegeAdmin.collegeCode }]
      }).select('_id');

      filter.studentId = { $in: students.map((student) => student._id) };
    }

    const applications = await Application.find(filter)
      .populate('studentId', 'name email collegeName collegeCode')
      .populate('scholarshipId', 'title provider deadline category')
      .sort({ createdAt: -1 });

    return res.json(applications);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

router.patch('/:id/status', auth(['student', 'collegeAdmin', 'admin']), async (req, res) => {
  try {
    const { status } = req.body;
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!application) return res.status(404).json({ message: 'Application not found' });
    res.json(application);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

