import { Router } from 'express';
import {
  getConversations,
  getMessages,
  sendMessage,
  startConversation,
  markAsRead,
  getUnreadCount,
  deleteConversation
} from '../controllers/messageController';
import { authenticate } from '../middleware/auth';
import {
  validateSendMessage,
  validateMongoId,
  validatePagination,
  handleValidationErrors
} from '../middleware/validation';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Conversation routes
router.get('/conversations', validatePagination, getConversations);
router.get('/conversations/:conversationId', validateMongoId, getMessages);
router.delete('/conversations/:conversationId', validateMongoId, deleteConversation);

// Message routes
router.post('/send', validateSendMessage, sendMessage);
router.post('/start-conversation', startConversation);
router.put('/conversations/:conversationId/read', validateMongoId, markAsRead);
router.get('/unread-count', getUnreadCount);

export default router;