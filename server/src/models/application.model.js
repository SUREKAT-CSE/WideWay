const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    scholarshipId: { type: mongoose.Schema.Types.ObjectId, ref: 'Scholarship', required: true },
    status: {
      type: String,
      enum: ['Applied', 'Under Review', 'Selected', 'Rejected'],
      default: 'Applied'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Application', applicationSchema);

