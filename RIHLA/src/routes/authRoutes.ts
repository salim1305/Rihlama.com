import { Router } from 'express';
import {
  register,
  login,
  logout,
  getMe,
  updateMe,
  changePassword,
  refreshToken,
  becomeHost,
  forgotPassword,
  verifyEmail
} from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import {
  validateRegister,
  validateLogin,
  handleValidationErrors
} from '../middleware/validation';

const router = Router();

// Public routes
router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.post('/logout', logout);
router.post('/refresh-token', refreshToken);
router.post('/forgot-password', forgotPassword);

// Protected routes
router.use(authenticate); // All routes below require authentication

router.get('/me', getMe);
router.put('/me', updateMe);
router.put('/change-password', changePassword);
router.post('/become-host', becomeHost);
router.post('/verify-email', verifyEmail);

export default router;