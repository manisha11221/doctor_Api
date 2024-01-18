const mongoose = require('mongoose');

const chat_roomShema = new mongoose.Schema({
    doctor_id: {
        type: mongoose.Schema.Types.ObjectId,
    },
    patients_id: {
        type: mongoose.Schema.Types.ObjectId,
    },
    createdAt: {
        type: Date,
    },
    updatedAt: {
        type: Date,
    },
})

const chat_room = mongoose.model('chat_room', chat_roomSchema);

module.exports = chat_room;