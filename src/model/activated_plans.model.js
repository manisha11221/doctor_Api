const mongoose = rrquire('mongoose');

const activated_plansSchema = new mongoose.Schema({
    patiant_id: {
        type: mongoose.Schema.Types.ObjectId,
    },
    both_plane: {
        type: mongoose.Schema.Types.ObjectId
    },
    plan_time: {
        type: String
    },
    createdAt: {
        type: Date,
    },
    updatedAt: {
        type: Date,
    }

})

const activated_plans = mongoose.model("activated_plans", activated_activated_plansSchema);

module.exports = activated_plans;