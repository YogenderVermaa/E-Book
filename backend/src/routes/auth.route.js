import { Router } from 'express';
import {
  registerUser,
  loginUser,
  getProfile,
  updateUserProfile,
} from '../controller/auth.controller.js';
import { verifyJWT } from '../middleware/auth.middleware.js';

const router = Router();

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/profile').get(verifyJWT, getProfile);
router.route('/profile').put(verifyJWT, updateUserProfile);

export default router;
