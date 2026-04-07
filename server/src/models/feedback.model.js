const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    scholarshipId: { type: mongoose.Schema.Types.ObjectId, ref: 'Scholarship', required: true },
    experience: { type: String, required: true },
    tips: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Feedback', feedbackSchema);

