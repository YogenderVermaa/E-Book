import { User } from '../models/User.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/api-error.js';
import { ApiResponse } from '../utils/api-response.js';

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    throw new ApiError(400, 'All fileds are required');
  }

  const existedUser = await User.findOne({ email });
  if (existedUser) {
    throw new ApiError(400, 'User already exists');
  }

  const newUser = await User.create({
    name,
    email,
    password,
  });

  const user = await User.findById(newUser?._id).select('-password');
  if (!user) {
    throw new ApiError(500, 'Registration Failed');
  }
  const token = user.generateToken();

  const options = {
    secure: false,
    httpOnly: true,
  };

  return res
    .status(201)
    .cookie('token', token, options)
    .json(new ApiResponse(201, { user, token }, 'User created successfully'));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ApiError(400, 'Email and Password Required');
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const isPassCorrect = await user.matchPassword(password);
  if (!isPassCorrect) {
    throw new ApiError(401, 'Invalid Credentials');
  }
  const token = user.generateToken();
  const options = {
    httpOnly: false,
    secure: true,
  };

  return res
    .status(200)
    .cookie('token', token, options)
    .json(
      new ApiResponse(
        200,
        {
          _id: user._id,
          name: user.name,
          email: user.email,
          token: token,
        },
        'logged in sucessfully'
      )
    );
});

const getProfile = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  res.status(200).json(
    new ApiResponse(
      200,
      {
        _id: user?._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        isPro: user.isPro,
      },
      'User profile patched successfully'
    )
  );
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const user = req.user;

  if (!user) {
    throw new ApiError(403, 'Auauthorized Access');
  }

  user.name = req.body.name || user.name;

  const updatedUser = await user.save();

  res.status(200).json(new ApiResponse(200, updatedUser, 'Profile updated success'));
});

export { registerUser, loginUser, getProfile, updateUserProfile };
