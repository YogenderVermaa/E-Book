import jwt from 'jsonwebtoken';
import { User } from '../models/User.model.js';
import { ApiError } from '../utils/api-error.js';
import { logger } from '../logger/index.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const verifyJWT = asyncHandler(async (req, _, next) => {
  // Accept token from: Cookie, Header OR Query string
  const token =
    req.cookies?.token || req.header('authorization')?.replace('Bearer ', '') || req.query?.token;

  if (!token) {
    logger.error('No token provided in cookies, Authorization header, or query token');
    throw new ApiError(401, 'Unauthorized access');
  }

  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findById(decodedToken?._id).select('-password');
  if (!user) {
    logger.error('User not found for decoded token');
    throw new ApiError(401, 'User not authorized');
  }

  req.user = user;
  next();
});
