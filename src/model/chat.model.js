// const mongoose = require('mongoose');

// const chatSchema = new mongoose.Schema({
//     room_id: {
//         type: mongoose.Schema.Types.ObjectId,
//     },
//     chats: [
//         {
//             type: String,
//         }
//     ],
//     createdAt: {
//         type: Date,
//         required: true
//     },
//     updatedAt: {
//         type: Date,
//         required: true
//     },
// })

// const Chat = mongoose.model('Chat', chatSchema);

// module.exports = Chat;



const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    room_id: {
        type: mongoose.Schema.Types.ObjectId,
    },
    chats: [
        {
            senderType: {
                type: String,
                enum: ['doctor', 'patient'],
                required: true,
            },
            message: {
                type: String,
            },
            createdAt: {
                type: Date,
                default: Date.now,
            },
        }
    ],
    createdAt: {
        type: Date,
        required: true,
    },
    updatedAt: {
        type: Date,
        required: true,
    },
});

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;

