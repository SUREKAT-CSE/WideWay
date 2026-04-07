const express = require('express');
const auth = require('../middleware/auth.middleware');
const User = require('../models/user.model');
const Scholarship = require('../models/scholarship.model');
const Application = require('../models/application.model');
const Feedback = require('../models/feedback.model');

const router = express.Router();

router.get('/student', auth('student'), async (req, res) => {
  try {
    const [totalScholarships, myApplications, statusBreakdown] = await Promise.all([
      Scholarship.countDocuments(),
      Application.countDocuments({ studentId: req.user.id }),
      Application.aggregate([
        { $match: { studentId: req.user.id } },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ])
    ]);

    return res.json({
      totalScholarships,
      myApplications,
      statusBreakdown
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

router.get('/college-admin', auth('collegeAdmin'), async (req, res) => {
  try {
    const collegeUser = await User.findById(req.user.id).select('collegeName collegeCode');
    if (!collegeUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const students = await User.find({
      role: 'student',
      $or: [{ collegeName: collegeUser.collegeName }, { collegeCode: collegeUser.collegeCode }]
    }).select('_id');

    const studentIds = students.map((student) => student._id);

    const [totalStudents, totalApplications, statusBreakdown] = await Promise.all([
      students.length,
      Application.countDocuments({ studentId: { $in: studentIds } }),
      Application.aggregate([
        { $match: { studentId: { $in: studentIds } } },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ])
    ]);

    return res.json({
      totalStudents,
      totalApplications,
      statusBreakdown
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

router.get('/admin', auth('admin'), async (req, res) => {
  try {
    const [usersCount, scholarshipCount, applicationCount, feedbackCount, roleBreakdown] =
      await Promise.all([
        User.countDocuments(),
        Scholarship.countDocuments(),
        Application.countDocuments(),
        Feedback.countDocuments(),
        User.aggregate([{ $group: { _id: '$role', count: { $sum: 1 } } }])
      ]);

    return res.json({
      usersCount,
      scholarshipCount,
      applicationCount,
      feedbackCount,
      roleBreakdown
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

