import { Router } from 'express';
import {
  createBooking,
  getUserBookings,
  getHostBookings,
  getBooking,
  updateBookingStatus,
  cancelBooking
} from '../controllers/bookingController';
import { authenticate, authorize } from '../middleware/auth';
import {
  validateCreateBooking,
  validateMongoId,
  validatePagination,
  handleValidationErrors
} from '../middleware/validation';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Guest routes
router.post('/', validateCreateBooking, createBooking);
router.get('/my-bookings', validatePagination, getUserBookings);
router.get('/:id', validateMongoId, getBooking);
router.put('/:id/cancel', validateMongoId, cancelBooking);

// Host routes
router.get('/host/bookings', authorize('host'), validatePagination, getHostBookings);
router.put('/:id/status', authorize('host'), validateMongoId, updateBookingStatus);

export default router;