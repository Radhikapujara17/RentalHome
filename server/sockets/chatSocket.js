const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { Conversation } = require('../models/Chat');
const { getJwtSecret } = require('../utils/helpers');

const parseCookieToken = (cookieHeader = '') => {
  const match = cookieHeader.match(/(?:^|;\s*)rentnest_token=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
};

const chatSocket = (io) => {
  // Require valid JWT on WebSocket handshake
  io.use(async (socket, next) => {
    try {
      const authHeader = socket.handshake.headers?.authorization || '';
      const headerToken = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
      const token = socket.handshake.auth?.token || headerToken || parseCookieToken(socket.handshake.headers?.cookie);

      if (!token) {
        return next(new Error('Authentication required'));
      }

      const decoded = jwt.verify(token, getJwtSecret());
      const user = await User.findById(decoded.id).select('_id name isDeleted');
      if (!user || user.isDeleted) {
        return next(new Error('Invalid or deactivated user'));
      }

      socket.userId = user._id.toString();
      socket.userName = user.name;
      next();
    } catch (err) {
      next(new Error('Authentication failed'));
    }
  });

  io.on('connection', (socket) => {
    // Join conversation room only if authenticated user is a participant
    socket.on('joinConversation', async (conversationId) => {
      try {
        if (!conversationId) return;
        const conversation = await Conversation.findById(conversationId).select('participants');
        if (!conversation) return;
        const isParticipant = conversation.participants.some((p) => p.toString() === socket.userId);
        if (!isParticipant) return;
        socket.join(conversationId);
      } catch {
        // Ignore invalid conversation IDs
      }
    });

    // Handle new message only inside rooms the socket already joined
    socket.on('newMessage', (data) => {
      if (!data?.conversationId || !socket.rooms.has(data.conversationId)) return;
      socket.to(data.conversationId).emit('messageReceived', data.message);
    });

    // Handle typing indicators
    socket.on('typing', ({ conversationId }) => {
      if (!conversationId || !socket.rooms.has(conversationId)) return;
      socket.to(conversationId).emit('userTyping', { userName: socket.userName });
    });

    socket.on('stopTyping', ({ conversationId }) => {
      if (!conversationId || !socket.rooms.has(conversationId)) return;
      socket.to(conversationId).emit('userStoppedTyping');
    });

    socket.on('disconnect', () => {});
  });
};

module.exports = chatSocket;
