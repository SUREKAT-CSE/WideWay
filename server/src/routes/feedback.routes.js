const express = require('express');
const Feedback = require('../models/feedback.model');
const auth = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/', auth('student'), async (req, res) => {
  try {
    const { scholarshipId, experience, tips } = req.body;
    const feedback = await Feedback.create({
      studentId: req.user.id,
      scholarshipId,
      experience,
      tips
    });
    res.status(201).json(feedback);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:scholarshipId', async (req, res) => {
  try {
    const feedbacks = await Feedback.find({
      scholarshipId: req.params.scholarshipId
    }).populate('studentId', 'name collegeName');

    res.json(feedbacks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

