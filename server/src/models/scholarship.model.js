const mongoose = require('mongoose');

const scholarshipSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    provider: { type: String, required: true },
    description: { type: String },
    deadline: { type: Date, required: true },
    applyLink: { type: String, required: true },
    youtubeLinks: [{ type: String }],
    category: {
      type: String,
      enum: ['Government', 'Private'],
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Scholarship', scholarshipSchema);

