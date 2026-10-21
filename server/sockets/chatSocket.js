const chatSocket = (io) => {
  io.on('connection', (socket) => {
    // console.log(`🔌 Client connected to WebSocket: ${socket.id}`);

    // Join conversation room
    socket.on('joinConversation', (conversationId) => {
      socket.join(conversationId);
      // console.log(`Client ${socket.id} joined room ${conversationId}`);
    });

    // Handle new message
    socket.on('newMessage', (data) => {
      // Broadcast to other users in the room
      socket.to(data.conversationId).emit('messageReceived', data.message);
    });

    // Handle typing indicators
    socket.on('typing', ({ conversationId, userName }) => {
      socket.to(conversationId).emit('userTyping', { userName });
    });

    socket.on('stopTyping', ({ conversationId }) => {
      socket.to(conversationId).emit('userStoppedTyping');
    });

    socket.on('disconnect', () => {
      // console.log(`Client disconnected: ${socket.id}`);
    });
  });
};

module.exports = chatSocket;
