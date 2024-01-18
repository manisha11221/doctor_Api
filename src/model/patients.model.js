const mongoose = require('mongoose');

const patients_slotShema = new mongoose.Schema({

    first_name: {
        type: String,
    },
    last_name: {
        type: String,
    },
    dob: {
        type: Date,
    },
    blood_group: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    mobile: {
        type: String,
    },
    address: {
        type: String,
    },
    city: {
        type: String,
    },
    zipcode: {
        type: String,
    },
    country: {
        type: String,
    },
    profile: {
        type: String,
    },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
})
const patients = mongoose.model('patients', patients_slotShema);

module.exports = patients;