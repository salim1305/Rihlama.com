import { Request, Response } from 'express';
import { Message, Conversation, IConversation } from '../models/Message';
import { User } from '../models/User';
import { Experience } from '../models/Experience';
import { catchAsync, createAppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';
import mongoose from 'mongoose';

// Get user's conversations
export const getConversations = catchAsync(async (req: AuthRequest, res: Response) => {
  const user = req.user;

  if (!user) {
    throw createAppError('Authentication required', 401);
  }

  const { page = 1, limit = 20 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const conversations = await Conversation.find({
    participants: user._id,
    isActive: true
  })
    .populate('participants', 'firstName lastName avatar')
    .populate('lastMessage')
    .populate('experienceId', 'title images')
    .sort({ lastMessageAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  const total = await Conversation.countDocuments({
    participants: user._id,
    isActive: true
  });

  const formattedConversations = conversations.map(conv => {
    // Find the other participant (not the current user)
    const otherParticipant = (conv as any).participants.find(
      (p: any) => p._id.toString() !== user._id
    );

    return {
      id: conv._id,
      experienceId: conv.experienceId ? (conv as any).experienceId._id : null,
      experienceTitle: conv.experienceId ? (conv as any).experienceId.title : null,
      experienceImages: conv.experienceId ? (conv as any).experienceId.images : null,
      otherParticipant: {
        id: otherParticipant._id,
        name: `${otherParticipant.firstName} ${otherParticipant.lastName}`,
        avatar: otherParticipant.avatar
      },
      lastMessage: conv.lastMessage ? {
        id: (conv as any).lastMessage._id,
        content: (conv as any).lastMessage.content,
        senderId: (conv as any).lastMessage.senderId,
        createdAt: (conv as any).lastMessage.createdAt
      } : null,
      lastMessageAt: conv.lastMessageAt,
      unreadCount: conv.unreadCount.get(user._id) || 0,
      createdAt: conv.createdAt
    };
  });

  res.status(200).json({
    success: true,
    data: {
      conversations: formattedConversations,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
        totalResults: total,
        limit: Number(limit)
      }
    }
  });
});

// Get messages in a conversation
export const getMessages = catchAsync(async (req: AuthRequest, res: Response) => {
  const { conversationId } = req.params;
  const user = req.user;

  if (!user) {
    throw createAppError('Authentication required', 401);
  }

  const { page = 1, limit = 50 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  // Check if user is part of this conversation
  const conversation = await Conversation.findOne({
    _id: conversationId,
    participants: user._id
  });

  if (!conversation) {
    throw createAppError('Conversation not found', 404);
  }

  // Get messages
  const messages = await Message.find({
    $or: [
      { senderId: { $in: conversation.participants }, receiverId: { $in: conversation.participants } }
    ]
  })
    .populate('senderId', 'firstName lastName avatar')
    .populate('receiverId', 'firstName lastName avatar')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  // Mark messages as read
  await Message.updateMany({
    receiverId: user._id,
    senderId: { $in: conversation.participants },
    isRead: false
  }, {
    isRead: true,
    readAt: new Date()
  });

  // Update unread count in conversation
  conversation.unreadCount.set(user._id, 0);
  await conversation.save();

  const formattedMessages = messages.reverse().map(msg => ({
    id: msg._id,
    senderId: msg.senderId._id,
    senderName: `${(msg as any).senderId.firstName} ${(msg as any).senderId.lastName}`,
    senderAvatar: (msg as any).senderId.avatar,
    receiverId: msg.receiverId._id,
    receiverName: `${(msg as any).receiverId.firstName} ${(msg as any).receiverId.lastName}`,
    content: msg.content,
    messageType: msg.messageType,
    isRead: msg.isRead,
    readAt: msg.readAt,
    createdAt: msg.createdAt
  }));

  const total = await Message.countDocuments({
    $or: [
      { senderId: { $in: conversation.participants }, receiverId: { $in: conversation.participants } }
    ]
  });

  res.status(200).json({
    success: true,
    data: {
      messages: formattedMessages,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
        totalResults: total,
        limit: Number(limit)
      }
    }
  });
});

// Send a message
export const sendMessage = catchAsync(async (req: AuthRequest, res: Response) => {
  const user = req.user;

  if (!user) {
    throw createAppError('Authentication required', 401);
  }

  const { receiverId, content, experienceId, messageType = 'text' } = req.body;

  // Validate receiver exists
  const receiver = await User.findById(receiverId);
  if (!receiver) {
    throw createAppError('Receiver not found', 404);
  }

  // Validate experience if provided
  let experience = null;
  if (experienceId) {
    experience = await Experience.findById(experienceId);
    if (!experience) {
      throw createAppError('Experience not found', 404);
    }
  }

  // Find or create conversation
  let conversation = await Conversation.findOne({
    participants: { $all: [user._id, receiverId], $size: 2 },
    experienceId: experienceId || null
  });

  if (!conversation) {
    conversation = await Conversation.create({
      participants: [user._id, receiverId],
      experienceId: experienceId || null,
      unreadCount: new Map([[user._id, 0], [receiverId, 0]])
    });
  }

  // Create message
  const message = await Message.create({
    senderId: user._id,
    receiverId,
    experienceId: experienceId || null,
    content: content.trim(),
    messageType
  });

  // Update conversation
  conversation.lastMessage = message._id as any;
  conversation.lastMessageAt = new Date();
  
  // Increment unread count for receiver
  const currentUnreadCount = conversation.unreadCount.get(receiverId) || 0;
  conversation.unreadCount.set(receiverId, currentUnreadCount + 1);
  
  await conversation.save();

  // Populate message for response
  await message.populate([
    { path: 'senderId', select: 'firstName lastName avatar' },
    { path: 'receiverId', select: 'firstName lastName avatar' }
  ]);

  res.status(201).json({
    success: true,
    message: 'Message sent successfully',
    data: {
      message: {
        id: message._id,
        conversationId: conversation._id,
        senderId: message.senderId._id,
        senderName: `${(message as any).senderId.firstName} ${(message as any).senderId.lastName}`,
        receiverId: message.receiverId._id,
        receiverName: `${(message as any).receiverId.firstName} ${(message as any).receiverId.lastName}`,
        content: message.content,
        messageType: message.messageType,
        createdAt: message.createdAt
      }
    }
  });
});

// Start conversation with host about experience
export const startConversation = catchAsync(async (req: AuthRequest, res: Response) => {
  const user = req.user;

  if (!user) {
    throw createAppError('Authentication required', 401);
  }

  const { experienceId, message } = req.body;

  // Validate experience
  const experience = await Experience.findById(experienceId).populate('hostId');
  if (!experience) {
    throw createAppError('Experience not found', 404);
  }

  const hostId = (experience as any).hostId._id;

  // Can't message yourself
  if (hostId.toString() === user._id) {
    throw createAppError('Cannot message yourself', 400);
  }

  // Check if conversation already exists
  let conversation = await Conversation.findOne({
    participants: { $all: [user._id, hostId], $size: 2 },
    experienceId
  });

  if (conversation) {
    return res.status(200).json({
      success: true,
      message: 'Conversation already exists',
      data: {
        conversationId: conversation._id,
        exists: true
      }
    });
  }

  // Create new conversation
  conversation = await Conversation.create({
    participants: [user._id, hostId],
    experienceId,
    unreadCount: new Map([[user._id, 0], [hostId.toString(), 0]])
  });

  // Send initial message if provided
  if (message && message.trim()) {
    const initialMessage = await Message.create({
      senderId: user._id,
      receiverId: hostId,
      experienceId,
      content: message.trim(),
      messageType: 'text'
    });

    conversation.lastMessage = initialMessage._id as any;
    conversation.lastMessageAt = new Date();
    conversation.unreadCount.set(hostId.toString(), 1);
    await conversation.save();
  }

  res.status(201).json({
    success: true,
    message: 'Conversation started successfully',
    data: {
      conversationId: conversation._id,
      experienceTitle: experience.title,
      hostName: `${(experience as any).hostId.firstName} ${(experience as any).hostId.lastName}`,
      exists: false
    }
  });
});

// Mark messages as read
export const markAsRead = catchAsync(async (req: AuthRequest, res: Response) => {
  const { conversationId } = req.params;
  const user = req.user;

  if (!user) {
    throw createAppError('Authentication required', 401);
  }

  // Check if user is part of conversation
  const conversation = await Conversation.findOne({
    _id: conversationId,
    participants: user._id
  });

  if (!conversation) {
    throw createAppError('Conversation not found', 404);
  }

  // Mark messages as read
  const result = await Message.updateMany({
    receiverId: user._id,
    senderId: { $in: conversation.participants },
    isRead: false
  }, {
    isRead: true,
    readAt: new Date()
  });

  // Update conversation unread count
  conversation.unreadCount.set(user._id, 0);
  await conversation.save();

  res.status(200).json({
    success: true,
    message: 'Messages marked as read',
    data: {
      markedCount: result.modifiedCount
    }
  });
});

// Get unread message count
export const getUnreadCount = catchAsync(async (req: AuthRequest, res: Response) => {
  const user = req.user;

  if (!user) {
    throw createAppError('Authentication required', 401);
  }

  const unreadCount = await Message.countDocuments({
    receiverId: user._id,
    isRead: false
  });

  res.status(200).json({
    success: true,
    data: {
      unreadCount
    }
  });
});

// Delete conversation (soft delete)
export const deleteConversation = catchAsync(async (req: AuthRequest, res: Response) => {
  const { conversationId } = req.params;
  const user = req.user;

  if (!user) {
    throw createAppError('Authentication required', 401);
  }

  const conversation = await Conversation.findOne({
    _id: conversationId,
    participants: user._id
  });

  if (!conversation) {
    throw createAppError('Conversation not found', 404);
  }

  // Soft delete by marking as inactive
  conversation.isActive = false;
  await conversation.save();

  res.status(200).json({
    success: true,
    message: 'Conversation deleted successfully'
  });
});