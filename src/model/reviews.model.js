const mongoose = require('mongoose');

const reviewsSchema = new mongoose.Schema({
  doctor_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  patient_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  count: {
    type: Number,
    required: true,
    max: 5,
  },
  Description: [
    {
      patient_id: {
        type: mongoose.Schema.Types.ObjectId,
        
      },
      description: {
        type: String,
        
      },
      user: {
        type: Number,
        enum: [0, 1],
        
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Review = mongoose.model('Review', reviewsSchema);

module.exports = Review;
