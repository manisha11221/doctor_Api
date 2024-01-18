const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    mobile_number: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    profile: {
        type: String,
    },
    username: {
        type: String,
    },
    email: {
        type: String,
    },
    first_name: {
        type: String,
    },
    last_name: {
        type: String,
    },
    Gender: {
        type: String,
    },
    DOB: {
        type: Date,
    },
    Biography: {
        type: String,
    },
    clinic_name: {
        type: String,
    },
    Cilinic_address: {
        type: String,
    },
    Clinic_image: [
        {
            Clinic_image: {
                type: String
            }
        }
    ],
    address_line_1: {
        type: String,
    },
    address_line_2: {
        type: String,
    },
    city: {
        type: String,
    },
    state: {
        type: String,
    },
    country: {
        type: String,
    },
    postal_code: {
        type: String,
    },
    Education: [
        {
            degree: String,
            college_institute: String,
            year_of_completion: String,
        },
    ],
    Experience: [
        {
            hospital_name: String,
            from: String,
            to: String,
          },
    ],
    Designation: [
        {
            Designation: {
                type: String
            }
        }
    ],
    Awards: [
        {
            Awards: {
                type: String
            }
        }
    ],
    Memberships: [
        {
            Memberships: {
                type: String,
            }
        }
    ],
    Registrations: [
        {
            Registrations: {
                type: String
            }
        }
    ],
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
});


const doctor = mongoose.model('doctor', doctorSchema);

module.exports = doctor;
