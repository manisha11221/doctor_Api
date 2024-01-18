const mongoose =  require('mongoose');

const plansSchema = new mongoose.Schema ({
    plane_name:{
        type : String
    },
    monthly: {
        type :String
    },
    yearly : {
        type: String
    },
    createdAt: {
        type: Date,
    },
    updatedAt: {
        type: Date,
    }  

})

const plans = mongoose.model("plan", plansSchema );

module.exports = plans;