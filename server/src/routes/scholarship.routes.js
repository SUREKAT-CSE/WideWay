const express = require('express');
const Scholarship = require('../models/scholarship.model');
const auth = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    const filter = {};

    if (category) {
      filter.category = category;
    }

    if (search) {
      filter.title = { $regex: search, $options: 'i' };
    }

    const scholarships = await Scholarship.find(filter).sort({ deadline: 1 });
    res.json(scholarships);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const scholarship = await Scholarship.findById(req.params.id);
    if (!scholarship) {
      return res.status(404).json({ message: 'Scholarship not found' });
    }
    return res.json(scholarship);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', auth(['admin', 'collegeAdmin']), async (req, res) => {
  try {
    const scholarship = await Scholarship.create(req.body);
    res.status(201).json(scholarship);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', auth(['admin', 'collegeAdmin']), async (req, res) => {
  try {
    const scholarship = await Scholarship.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });
    if (!scholarship) return res.status(404).json({ message: 'Scholarship not found' });
    res.json(scholarship);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', auth(['admin', 'collegeAdmin']), async (req, res) => {
  try {
    const scholarship = await Scholarship.findByIdAndDelete(req.params.id);
    if (!scholarship) return res.status(404).json({ message: 'Scholarship not found' });
    res.json({ message: 'Scholarship deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

