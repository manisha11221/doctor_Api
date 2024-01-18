const Chat = require('../model/chat.model');

async function createChatRoom(req, res) {
  const { patient_id, doctor_id } = req.body;

  try {
    // Create a new chat room
    const newChatRoom = await Chat.create({
      patient_id,
      doctor_id,
      chats: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return res.status(201).json({ chatRoomId: newChatRoom._id });
  } catch (error) {
    console.error('Error creating chat room:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

//simple only send message 

// async function sendMessage(req, res) {
//   const { chatRoomId, chat } = req.body;

//   try {
//     // Find the chat room by ID
//     const chatRoom = await Chat.findById(chatRoomId);

//     if (!chatRoom) {
//       console.log('Chat Room Not Found');
//       return res.status(404).json({ error: 'Chat room not found' });
//     }

//     // Add the new message to the chat room
//     chatRoom.chats.push(chat);
//     await chatRoom.save();

//     return res.status(200).json(chatRoom);
//   } catch (error) {
//     console.error('Error sending message:', error);
//     return res.status(500).json({ error: 'Internal Server Error' });
//   }
// }


// send with type 
async function sendMessage(req, res) {
  const { chatRoomId, senderType, chat } = req.body;

  try {
    // Find the chat room by ID
    const chatRoom = await Chat.findById(chatRoomId);

    if (!chatRoom) {
      console.log('Chat Room Not Found');
      return res.status(404).json({ error: 'Chat room not found' });
    }

    // Add the new message to the chat room
    chatRoom.chats.push({ senderType, message: chat });
    await chatRoom.save();

    return res.status(200).json(chatRoom);
  } catch (error) {
    console.error('Error sending message:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}


//get al messages 

async function getAllMessage(req, res) {
  const { room_id } = req.body;

  try {
    const chatMessage = await Chat.findById(room_id);
    if (!chatMessage) {
      console.log('Chat Room Not Found');
      return res.status(404).json({ error: 'Chat room not found' });
    }

    const allMessages = chatMessage.chats;

    return res.status(200).json({ messages: allMessages });
  } catch (error) {
    console.error('Error getting all messages:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }

}

module.exports = {
  createChatRoom,
  sendMessage,
  getAllMessage
};
