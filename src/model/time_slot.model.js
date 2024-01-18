const mongoose = require('mongoose');

const time_slotSchema = new mongoose.Schema({
  Doctor_id: {
    type: mongoose.Schema.Types.ObjectId,
  },
  available_slot: {
    type: Object,
  },
  slot_duration: {
    type: String,

  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const time_slot = mongoose.model('time_slot', time_slotSchema);

module.exports = time_slot;
