import { Router } from 'express';
import {
  getUserProfile,
  searchUsers,
  getFavorites,
  getDashboardStats,
  updatePreferences
} from '../controllers/userController';
import { authenticate, optionalAuth } from '../middleware/auth';
import { validateMongoId, validatePagination } from '../middleware/validation';

const router = Router();

// Public routes
router.get('/search', validatePagination, searchUsers);
router.get('/:id', validateMongoId, getUserProfile);

// Protected routes
router.use(authenticate);

router.get('/me/favorites', validatePagination, getFavorites);
router.get('/me/dashboard', getDashboardStats);
router.put('/me/preferences', updatePreferences);

export default router;