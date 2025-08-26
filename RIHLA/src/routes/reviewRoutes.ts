import { Router } from 'express';
import {
  getExperienceReviews,
  createReview,
  updateReview,
  deleteReview,
  markHelpful,
  reportReview,
  getUserReviews,
  getHostReviews
} from '../controllers/reviewController';
import { authenticate, authorize, optionalAuth } from '../middleware/auth';
import {
  validateCreateReview,
  validateMongoId,
  validatePagination,
  handleValidationErrors
} from '../middleware/validation';

const router = Router();

// Public routes
router.get('/experience/:experienceId', validateMongoId, validatePagination, getExperienceReviews);

// Protected routes
router.use(authenticate);

// User routes
router.post('/', validateCreateReview, createReview);
router.get('/my-reviews', validatePagination, getUserReviews);
router.put('/:id', validateMongoId, updateReview);
router.delete('/:id', validateMongoId, deleteReview);
router.put('/:id/helpful', validateMongoId, markHelpful);
router.post('/:id/report', validateMongoId, reportReview);

// Host routes
router.get('/host/received', authorize('host'), validatePagination, getHostReviews);

export default router;