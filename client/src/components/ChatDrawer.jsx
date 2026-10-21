import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import io from 'socket.io-client';
import toast from 'react-hot-toast';
import { 
  MessageSquare, 
  X, 
  Send, 
  ShieldAlert, 
  User, 
  Building, 
  Loader2,
  ChevronLeft
} from 'lucide-react';

let socket;

const ChatDrawer = ({ isOpen, onClose }) => {
  const { user, isAuthenticated } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Initialize Socket.io connection
  useEffect(() => {
    if (isAuthenticated) {
      const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
      socket = io(socketUrl);

      socket.on('messageReceived', (newMsg) => {
        if (activeConversation && newMsg.conversation === activeConversation._id) {
          setMessages((prev) => [...prev, newMsg]);
        }
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [isAuthenticated, activeConversation]);

  // Fetch user conversations
  useEffect(() => {
    if (isOpen && isAuthenticated) {
      const fetchConversations = async () => {
        try {
          setLoading(true);
          const res = await api.get('/chat/conversations');
          if (res.data.success) {
            setConversations(res.data.conversations);
            if (res.data.conversations.length > 0 && !activeConversation) {
              selectConversation(res.data.conversations[0]);
            }
          }
        } catch (err) {
          console.error('Failed to load conversations:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchConversations();
    }
  }, [isOpen, isAuthenticated]);

  const selectConversation = async (conv) => {
    setActiveConversation(conv);
    if (socket) {
      socket.emit('joinConversation', conv._id);
    }
    try {
      const res = await api.get(`/chat/conversations/${conv._id}/messages`);
      if (res.data.success) {
        setMessages(res.data.messages);
      }
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() || !activeConversation) return;

    try {
      const res = await api.post('/chat/messages', {
        conversationId: activeConversation._id,
        text: text.trim()
      });

      if (res.data.success) {
        const newMsg = res.data.message;
        setMessages((prev) => [...prev, newMsg]);
        if (socket) {
          socket.emit('newMessage', {
            conversationId: activeConversation._id,
            message: newMsg
          });
        }
        setText('');
      }
    } catch (err) {
      toast.error('Failed to deliver message');
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isOpen) return null;

  const getRecipient = (conv) => {
    if (!conv || !conv.participants) return null;
    return conv.participants.find((p) => p._id !== user?.id) || conv.participants[0];
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[420px] bg-white shadow-2xl border-l border-slate-200 flex flex-col animate-slide-in">
      
      {/* Header */}
      <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {activeConversation && (
            <button
              onClick={() => setActiveConversation(null)}
              className="sm:hidden p-1 hover:bg-slate-800 rounded-lg"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          <MessageSquare className="w-5 h-5 text-blue-400" />
          <span className="font-extrabold text-sm">RentNest In-App Messaging</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-full hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Anti-Fraud Security Shield Banner */}
      <div className="bg-amber-50 border-b border-amber-200 p-3 text-xs text-amber-900 flex items-start space-x-2">
        <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="text-[11px] leading-tight">
          <strong>Security Shield:</strong> Never send token money or scan advance UPI QR codes before physically verifying the property with a visit pass.
        </p>
      </div>

      {/* Main Chat Area */}
      {!isAuthenticated ? (
        <div className="flex-1 p-8 text-center flex flex-col items-center justify-center space-y-3">
          <User className="w-12 h-12 text-slate-300" />
          <p className="text-xs font-bold text-slate-700">Please login to start in-app chat</p>
        </div>
      ) : activeConversation ? (
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          
          {/* Active Conversation Sub-header */}
          <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <img
                src={getRecipient(activeConversation)?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
                alt="Avatar"
                className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500/20"
              />
              <div>
                <span className="font-bold text-slate-900 block truncate max-w-[180px]">
                  {getRecipient(activeConversation)?.name || 'Landlord / Tenant'}
                </span>
                <span className="text-[10px] text-slate-500 block truncate max-w-[180px]">
                  {activeConversation.property?.title || 'Rental Home'}
                </span>
              </div>
            </div>
            <button
              onClick={() => setActiveConversation(null)}
              className="text-[11px] font-bold text-blue-600 hover:underline"
            >
              All Chats
            </button>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50">
            {messages.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                No messages yet. Send a message to inquire about visit timings or house rules.
              </div>
            ) : (
              messages.map((msg) => {
                const isMe = msg.sender?._id === user?.id || msg.sender === user?.id;
                return (
                  <div
                    key={msg._id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[80%] px-3.5 py-2 rounded-2xl text-xs font-medium ${
                        isMe
                          ? 'bg-blue-600 text-white rounded-br-none shadow-sm'
                          : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-sm'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[9px] text-slate-400 mt-0.5 px-1">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input Box */}
          <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-200 flex items-center space-x-2">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type message here..."
              className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100"
            />
            <button
              type="submit"
              disabled={!text.trim()}
              className="p-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-xl transition-all shadow-md"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      ) : (
        /* Conversations List */
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          <div className="p-3 font-bold text-xs uppercase tracking-wider text-slate-400 bg-slate-50">
            Your Active Inquiries ({conversations.length})
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600 mx-auto" />
            </div>
          ) : conversations.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500 space-y-2">
              <p className="font-bold">No active conversations</p>
              <p className="text-[11px] text-slate-400">
                Click "Chat with Owner" on any property page to start a chat.
              </p>
            </div>
          ) : (
            conversations.map((conv) => {
              const recipient = getRecipient(conv);
              return (
                <div
                  key={conv._id}
                  onClick={() => selectConversation(conv)}
                  className="p-3.5 hover:bg-slate-50 cursor-pointer flex items-center space-x-3 transition-colors"
                >
                  <img
                    src={recipient?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
                    alt="User"
                    className="w-10 h-10 rounded-full object-cover shrink-0 ring-2 ring-blue-500/20"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <span className="text-xs font-bold text-slate-900 truncate">
                        {recipient?.name || 'Owner'}
                      </span>
                      <span className="text-[10px] text-slate-400 shrink-0">
                        {new Date(conv.lastMessageAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate">
                      {conv.lastMessage || 'Click to view chat'}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

    </div>
  );
};

export default ChatDrawer;
