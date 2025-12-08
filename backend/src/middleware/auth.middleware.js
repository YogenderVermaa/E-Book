import jwt from 'jsonwebtoken';
import { User } from '../models/User.model.js';
import { ApiError } from '../utils/api-error.js';
import { logger } from '../logger/index.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const verifyJWT = asyncHandler(async (req, _, next) => {
  const token = req.cookies.token || req.header('authorization')?.replace('Bearer ', '');

  if (!token) {
    logger.error('No token provided in cookies or Authorization header');
    throw new ApiError(401, 'Unauthorized access');
  }

  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findById(decodedToken?._id).select('-password ');
  if (!user) {
    logger.error('User not found for decoded token');
    throw new ApiError(401, 'Unauthorized');
  }

  req.user = user;
  next();
});
