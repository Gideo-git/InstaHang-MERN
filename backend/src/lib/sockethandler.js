import jwt from 'jsonwebtoken';
import Message from './models/Message.js';
import Conversation from './models/Conversation.js';

const onlineUsers = new Map();

export const initializeSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`New connection: ${socket.id}`);

    // 1. AUTHENTICATE AND MAP USER
    socket.on('authenticate', (token) => {
      if (!token) {
        return socket.disconnect(); 
      }
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.user.id;
        
        // Map userId to the current socket id
        onlineUsers.set(userId, socket.id);
        socket.userId = userId; 

        console.log(`User authenticated: ${userId} is now ${socket.id}`);

        //all connected clients will be sent   about online users 
        io.emit('online_users_update', Array.from(onlineUsers.keys()));

      } catch (err) {
        console.error('Socket authentication error');
        socket.disconnect();
      }
    });


    // 2. CHAT FEATURES
    // User joins a conversation room
    socket.on('join_conversation', (conversationId) => {
      socket.join(conversationId);
      console.log(`User ${socket.userId} joined room: ${conversationId}`);
    });

    // Listen for a new message from a client
    socket.on('send_message', async ({ conversationId, content }) => {
      if (!socket.userId) return; // Must be authenticated

      try {
        //  Save the message to the database
        const message = new Message({
          conversationId,
          sender: socket.userId,
          content,
        });
        await message.save();

        // Update the conversation's last message timestamp
        await Conversation.findByIdAndUpdate(conversationId, {
          lastMessage: message._id,
        });

        // Broadcast the new message to all clients in that conversation room
        const populatedMessage = await message.populate('sender', 'username profilePicture');
        io.to(conversationId).emit('receive_message', populatedMessage);
        
      } catch (err) {
        console.error('Error handling send_message:', err);
      }
    });


    // 3. CONNECTION REQUEST NOTIFICATIONS
    socket.on('send_connection_request', ({ recipientId, requesterInfo }) => {
      // Find the recipient's socket if they are online
      const recipientSocketId = onlineUsers.get(recipientId);

      if (recipientSocketId) {
        // Send a real-time notification to the specific recipient
        io.to(recipientSocketId).emit('new_connection_request', {
          message: `${requesterInfo.username} wants to connect!`,
          requester: requesterInfo, // e.g., { userId, username, profilePicture }
        });
      }
    });
    
    // Listen for when a request is accepted to notify the original requester
    socket.on('accept_connection_request', ({ requesterId, acceptorInfo }) => {
      const requesterSocketId = onlineUsers.get(requesterId);

      if(requesterSocketId) {
        io.to(requesterSocketId).emit('connection_request_accepted', {
          message: `${acceptorInfo.username} accepted your request!`,
          acceptor: acceptorInfo,
        });
      }
    });


    // 4. DISCONNECT HANDLING
    socket.on('disconnect', () => {
      if (socket.userId) {
        onlineUsers.delete(socket.userId);
        console.log(` User disconnected: ${socket.userId}`);
        // Let all clients know about the updated online users list
        io.emit('online_users_update', Array.from(onlineUsers.keys()));
      }
    });
  });
};