const mongoose = require('mongoose');

const specialitiesSchema = mongoose.Schema({
    uId: {
        type: String,
    },
    specialities: {
        type: String
    },
    createdAt: {
        type: String,
        default: new Date().toLocaleDateString()
    },
    updatedAt: {
        type: String,
        default: new Date().toLocaleDateString()
    },  
    image : {
        type :  String,
    }

})


const specialities = mongoose.model('specialities' , specialitiesSchema);

module.exports = specialities;