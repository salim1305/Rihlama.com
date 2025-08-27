import api from './api';

const messageService = {
  // Get user's conversations
  getConversations: async () => {
    try {
      const response = await api.get('/messages/conversations');
      return response.data.data.conversations;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch conversations');
    }
  },

  // Get messages in a conversation
  getMessages: async (conversationId, page = 1, limit = 50) => {
    try {
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', limit);
      
      const response = await api.get(`/messages/conversation/${conversationId}?${params.toString()}`);
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch messages');
    }
  },

  // Send a message
  sendMessage: async (conversationId, content, messageType = 'text') => {
    try {
      const response = await api.post('/messages', {
        conversationId,
        content,
        messageType,
      });
      return response.data.data.message;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to send message');
    }
  },

  // Start a new conversation with host about experience
  startConversation: async (experienceId, message) => {
    try {
      const response = await api.post('/messages/start-conversation', {
        experienceId,
        message,
      });
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to start conversation');
    }
  },

  // Mark messages as read
  markAsRead: async (conversationId) => {
    try {
      const response = await api.patch(`/messages/conversation/${conversationId}/read`);
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to mark messages as read');
    }
  },

  // Get unread message count
  getUnreadCount: async () => {
    try {
      const response = await api.get('/messages/unread-count');
      return response.data.data.count;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get unread count');
    }
  },
};

export default messageService;