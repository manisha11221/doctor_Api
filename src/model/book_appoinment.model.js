const mongoose = require('mongoose');

const book_appoinmentSchema = new mongoose.Schema({
    patients_id: {
        type: mongoose.Schema.Types.ObjectId,
    },
    doctor_id: {
        type: mongoose.Schema.Types.ObjectId,
    },
    book_date: {
        type: Date
    },
    book_time: {
        type: String
    },

    book_day: {
        type: String
    },

    accepted: {
        type: Number
    },

    createdAt: {
        type: Date
    },
    updatedAt: {
        type: Date
    }
});

const book_appoinment = mongoose.model('book_appoinment', book_appoinmentSchema);

module.exports = book_appoinment;