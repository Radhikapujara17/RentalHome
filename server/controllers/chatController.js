const { Conversation, Message } = require('../models/Chat');

// @desc    Get user conversations
// @route   GET /api/v1/chat/conversations
// @access  Private
exports.getConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user.id
    })
      .populate('participants', 'name phone role avatar')
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
      .populate('participants', 'name phone role avatar')
      .populate('property', 'title pricing photos locality');

    res.status(200).json({
      success: true,
      conversation: populated
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get messages for a conversation
// @route   GET /api/v1/chat/conversations/:id/messages
// @access  Private
exports.getMessages = async (req, res, next) => {
  try {
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

// @desc    Send a message
// @route   POST /api/v1/chat/messages
// @access  Private
exports.sendMessage = async (req, res, next) => {
  try {
    const { conversationId, text } = req.body;

    if (!text || !conversationId) {
      return res.status(400).json({ success: false, message: 'Message text and conversationId required' });
    }

    const message = await Message.create({
      conversation: conversationId,
      sender: req.user.id,
      text
    });

    // Update conversation lastMessage
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: text,
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
