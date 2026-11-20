import { Router } from 'express';
import {
  sendOtp,
  verifyOtp,
  googleAuth,
  getProfile,
  updateUserProfile,
} from '../controller/auth.controller.js';
import { verifyJWT } from '../middleware/auth.middleware.js';

const router = Router();

// Google 1-Click Authentication
router.route('/google').post(googleAuth);

// Passwordless Email OTP Authentication
router.route('/send-otp').post(sendOtp);
router.route('/verify-otp').post(verifyOtp);

// User Profile
router.route('/profile').get(verifyJWT, getProfile);
router.route('/profile').put(verifyJWT, updateUserProfile);

// Backwards compatibility aliases
router.route('/login').post(sendOtp);
router.route('/register').post(sendOtp);

export default router;
