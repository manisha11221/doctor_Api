const route = require('express').Router();

const {
    createChatRoom,
    sendMessage,
    getAllMessage

}= require('../controller/chat.ctrl')

route.post('/create-chat-room',createChatRoom);
route.post('/send-Message',sendMessage);
route.post('/getAll-Message',getAllMessage);

module.exports = route;  