const { Conversation, Message } = require('../models/Chat');
const User = require('../models/User');

// @desc    Get user conversations
// @route   GET /api/v1/chat/conversations
// @access  Private
exports.getConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user.id
    })
      .populate('participants', 'name role avatar')
      .populate('property', 'title pricing photos locality')
      .sort({ lastMessageAt: -1 });

    res.status(200).json({
      success: true,
      conversations
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get or create conversation with user about property
// @route   POST /api/v1/chat/conversations
// @access  Private
exports.getOrCreateConversation = async (req, res, next) => {
  try {
    const { recipientId, propertyId } = req.body;
    if (!recipientId) {
      return res.status(400).json({ success: false, message: 'Recipient ID is required' });
    }
    if (recipientId.toString() === req.user.id.toString()) {
      return res.status(400).json({ success: false, message: 'Cannot start a conversation with yourself' });
    }

    const recipient = await User.findOne({ _id: recipientId, isDeleted: { $ne: true } }).select('_id');
    if (!recipient) {
      return res.status(404).json({ success: false, message: 'Recipient user not found' });
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [req.user.id, recipientId] },
      ...(propertyId ? { property: propertyId } : {})
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [req.user.id, recipientId],
        property: propertyId || undefined,
        lastMessage: 'Conversation started',
        lastMessageAt: new Date()
      });
    }

    const populated = await Conversation.findById(conversation._id)
      .populate('participants', 'name role avatar')
      .populate('property', 'title pricing photos locality');

    res.status(200).json({
      success: true,
      conversation: populated
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get messages for a conversation (participants only)
// @route   GET /api/v1/chat/conversations/:id/messages
// @access  Private
exports.getMessages = async (req, res, next) => {
  try {
    const conversation = await Conversation.findById(req.params.id);
    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }

    const isParticipant = conversation.participants.some(
      (p) => p.toString() === req.user.id.toString()
    );
    if (!isParticipant && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to view this conversation' });
    }

    const messages = await Message.find({ conversation: req.params.id })
      .populate('sender', 'name avatar')
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      messages
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Send a message (participants only)
// @route   POST /api/v1/chat/messages
// @access  Private
exports.sendMessage = async (req, res, next) => {
  try {
    const { conversationId, text } = req.body;

    if (!text || !text.trim() || !conversationId) {
      return res.status(400).json({ success: false, message: 'Message text and conversationId are required' });
    }

    if (text.trim().length > 1000) {
      return res.status(400).json({ success: false, message: 'Message cannot exceed 1000 characters' });
    }

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }

    const isParticipant = conversation.participants.some(
      (p) => p.toString() === req.user.id.toString()
    );
    if (!isParticipant) {
      return res.status(403).json({ success: false, message: 'Not authorized to send messages in this conversation' });
    }

    const trimmed = text.trim();
    const message = await Message.create({
      conversation: conversationId,
      sender: req.user.id,
      text: trimmed
    });

    // Update conversation lastMessage
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: trimmed,
      lastMessageAt: new Date()
    });

    const populated = await Message.findById(message._id).populate('sender', 'name avatar');

    res.status(201).json({
      success: true,
      message: populated
    });
  } catch (error) {
    next(error);
  }
};
