import { Router } from 'express';
import {
  getExperiences,
  getExperience,
  createExperience,
  updateExperience,
  deleteExperience,
  getHostExperiences,
  getCategories,
  getCities
} from '../controllers/experienceController';
import { authenticate, authorize, optionalAuth } from '../middleware/auth';
import {
  validateCreateExperience,
  validateMongoId,
  validatePagination,
  handleValidationErrors
} from '../middleware/validation';

const router = Router();

// Public routes
router.get('/', validatePagination, getExperiences);
router.get('/categories', getCategories);
router.get('/cities', getCities);
router.get('/:id', validateMongoId, getExperience);

// Protected routes
router.use(authenticate);

// Host-only routes
router.post('/', authorize('host'), validateCreateExperience, createExperience);
router.get('/host/my-experiences', authorize('host'), validatePagination, getHostExperiences);
router.put('/:id', authorize('host'), validateMongoId, updateExperience);
router.delete('/:id', authorize('host'), validateMongoId, deleteExperience);

export default router;