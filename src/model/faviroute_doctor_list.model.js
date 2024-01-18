const mongoose = require('mongoose');

const faviroute_doctor_listSchema = new mongoose.Schema({
    patient_id: {
        type: mongoose.Schema.Types.ObjectId
    },
    doctor_id: {
        type: mongoose.Schema.Types.ObjectId
    },
    createdAt: {
        type: String,
    },
    updatedAt: {
        type: String,
    }

})

const faviroute_doctor_list = mongoose.model("faviroute_doctor_list", faviroute_doctor_listSchema);

module.exports = faviroute_doctor_list;