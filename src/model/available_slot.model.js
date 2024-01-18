const mongoose = require('mongoose');

const avaible_slotShema = new mongoose.Schema({
    date: {
        type: String,
        required: true
    },
    available_for_that_day: [
        {
            available_forthat_day: {
                type: String,
            }
        }
    ],
    doctor_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    createdAt: {
        type: String,
        required: true
    },
    updatedAt: {
        type: String,
        required: true
    },
})

const avaible_slot = mongoose.model('avaible_slot', avaible_slotShema);

module.exports = avaible_slot;