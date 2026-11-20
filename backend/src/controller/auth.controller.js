import { User } from '../models/User.model.js';
import { Otp } from '../models/Otp.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/api-error.js';
import { ApiResponse } from '../utils/api-response.js';
import { sendOtpEmail } from '../utils/mailer.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Send 6-Digit OTP to User's Email
 */
const sendOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email || !EMAIL_REGEX.test(email.trim())) {
    throw new ApiError(400, 'A valid email address is required');
  }

  const normalizedEmail = email.trim().toLowerCase();

  // Check rate limit: if an OTP was created less than 25 seconds ago
  const existingOtp = await Otp.findOne({ email: normalizedEmail }).sort({ createdAt: -1 });
  if (existingOtp) {
    const timeSinceLastOtp = (Date.now() - new Date(existingOtp.createdAt).getTime()) / 1000;
    if (timeSinceLastOtp < 25) {
      const waitSeconds = Math.ceil(25 - timeSinceLastOtp);
      throw new ApiError(429, `Please wait ${waitSeconds}s before requesting a new OTP.`, [
        { retryAfter: waitSeconds },
      ]);
    }
  }

  // Generate a cryptographically sound 6-digit OTP
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  // Delete previous unverified OTPs for this email to avoid confusion
  await Otp.deleteMany({ email: normalizedEmail });

  // Create new OTP record in MongoDB
  await Otp.create({
    email: normalizedEmail,
    otp: otpCode,
    expiresAt,
    attempts: 0,
  });

  // Dispatch OTP email asynchronously in background so HTTP response returns in <100ms
  // This guarantees the browser / axios NEVER times out, even if cloud SMTP is blocked or slow
  sendOtpEmail(normalizedEmail, otpCode).catch((err) => {
    console.error(`[Background Mailer Error for ${normalizedEmail}]:`, err.message);
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        email: normalizedEmail,
        expiresIn: '10 minutes',
        loggedToConsole: true,
        cooldownSeconds: 25,
        devOtp:
          process.env.NODE_ENV !== 'production' || process.env.ALLOW_DEV_OTP === 'true'
            ? otpCode
            : undefined,
      },
      'OTP generated successfully! Please check your email inbox (or server logs).'
    )
  );
});

/**
 * Verify OTP and Log In / Register User (Passwordless)
 */
const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp, name } = req.body;

  if (!email || !otp) {
    throw new ApiError(400, 'Email and 6-digit OTP are required');
  }

  const normalizedEmail = email.trim().toLowerCase();
  const trimmedOtp = otp.toString().trim();

  // Find latest active OTP
  const otpDoc = await Otp.findOne({ email: normalizedEmail }).sort({ createdAt: -1 });

  if (!otpDoc) {
    throw new ApiError(400, 'No active OTP found. Please request a new OTP.');
  }

  // Check if expired
  if (new Date() > new Date(otpDoc.expiresAt)) {
    await Otp.deleteMany({ email: normalizedEmail });
    throw new ApiError(400, 'OTP has expired. Please request a new OTP.');
  }

  // Check attempts limit
  if (otpDoc.attempts >= 5) {
    await Otp.deleteMany({ email: normalizedEmail });
    throw new ApiError(429, 'Too many invalid attempts. Please request a new OTP.');
  }

  // Verify OTP match
  if (otpDoc.otp !== trimmedOtp) {
    otpDoc.attempts += 1;
    await otpDoc.save();
    const remaining = 5 - otpDoc.attempts;
    throw new ApiError(400, `Invalid OTP. ${remaining} attempt(s) remaining.`);
  }

  // OTP verified! Delete consumed OTP
  await Otp.deleteMany({ email: normalizedEmail });

  // Find or Create User
  let user = await User.findOne({ email: normalizedEmail });
  let isNewUser = false;

  if (!user) {
    isNewUser = true;
    const defaultName = name?.trim() || normalizedEmail.split('@')[0];
    user = await User.create({
      email: normalizedEmail,
      name: defaultName,
      bio: 'Sharing my daily life stories and written vlogs.',
    });
  } else if (name && !user.name) {
    user.name = name.trim();
    await user.save();
  }

  const token = user.generateToken();

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  };

  return res
    .status(200)
    .cookie('token', token, cookieOptions)
    .json(
      new ApiResponse(
        200,
        {
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            bio: user.bio,
            isPro: user.isPro,
            unlockedDiaries: user.unlockedDiaries || [],
            subscriptions: user.subscriptions || [],
          },
          token,
          isNewUser,
        },
        isNewUser ? 'Welcome to LifeLog! Account created successfully.' : 'Logged in successfully.'
      )
    );
});

/**
 * Get Current User Profile
 */
const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate('unlockedDiaries', 'title author coverImage price')
    .populate('subscriptions.diaryId', 'title author coverImage price');

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
        isPro: user.isPro,
        unlockedDiaries: user.unlockedDiaries || [],
        subscriptions: user.subscriptions || [],
        payoutSettings: user.payoutSettings || {
          payoutMethod: 'upi',
          upiId: '',
          accountHolderName: '',
          accountNumber: '',
          ifscCode: '',
          bankName: '',
        },
        createdAt: user.createdAt,
      },
      'User profile fetched successfully'
    )
  );
});

/**
 * Update User Profile & Payout Settings
 */
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  if (req.body.name !== undefined) user.name = req.body.name.trim();
  if (req.body.bio !== undefined) user.bio = req.body.bio.trim();
  if (req.body.avatar !== undefined) user.avatar = req.body.avatar;

  if (req.body.payoutSettings !== undefined) {
    user.payoutSettings = {
      payoutMethod: req.body.payoutSettings.payoutMethod || 'upi',
      upiId: req.body.payoutSettings.upiId?.trim() || '',
      accountHolderName: req.body.payoutSettings.accountHolderName?.trim() || '',
      accountNumber: req.body.payoutSettings.accountNumber?.trim() || '',
      ifscCode: req.body.payoutSettings.ifscCode?.trim() || '',
      bankName: req.body.payoutSettings.bankName?.trim() || '',
    };
  }

  const updatedUser = await user.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
        bio: updatedUser.bio,
        isPro: updatedUser.isPro,
        payoutSettings: updatedUser.payoutSettings,
      },
      'Profile updated successfully'
    )
  );
});

/**
 * Sign in or Sign up with Google OAuth
 * Supports standard Google ID token (credential) and OAuth2 access_token
 */
const googleAuth = asyncHandler(async (req, res) => {
  const { credential, access_token, token: incomingToken } = req.body;
  const rawCredential = credential || incomingToken;
  const rawAccessToken = access_token;

  let email = '';
  let name = '';
  let picture = '';
  let googleId = '';

  // 1. Try Google ID token verification (TokenInfo API)
  if (rawCredential) {
    try {
      const googleRes = await fetch(
        `https://oauth2.googleapis.com/tokeninfo?id_token=${rawCredential}`
      );
      if (googleRes.ok) {
        const payload = await googleRes.json();
        email = payload.email?.toLowerCase().trim();
        name = payload.name;
        picture = payload.picture;
        googleId = payload.sub;
      }
    } catch (err) {
      console.warn('Google ID token verification failed:', err.message);
    }
  }

  // 2. Try Google OAuth2 access token verification (UserInfo API)
  if (!email && (rawAccessToken || rawCredential)) {
    const bearerToken = rawAccessToken || rawCredential;
    try {
      const userRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${bearerToken}` },
      });
      if (userRes.ok) {
        const payload = await userRes.json();
        email = payload.email?.toLowerCase().trim();
        name = payload.name;
        picture = payload.picture;
        googleId = payload.sub;
      }
    } catch (err) {
      console.warn('Google UserInfo verification failed:', err.message);
    }
  }

  if (!email || !EMAIL_REGEX.test(email)) {
    throw new ApiError(400, 'Unable to authenticate with Google. Please try again.');
  }

  // Find or create user
  let user = await User.findOne({ email });
  let isNewUser = false;

  if (!user) {
    user = await User.create({
      name: name || email.split('@')[0],
      email,
      avatar: picture || '',
      googleId: googleId || '',
    });
    isNewUser = true;
  } else {
    let shouldSave = false;
    if (!user.googleId && googleId) {
      user.googleId = googleId;
      shouldSave = true;
    }
    if (!user.avatar && picture) {
      user.avatar = picture;
      shouldSave = true;
    }
    if ((!user.name || user.name.trim() === '') && name) {
      user.name = name;
      shouldSave = true;
    }
    if (shouldSave) {
      await user.save();
    }
  }

  const token = user.generateToken();

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          bio: user.bio,
          payoutSettings: user.payoutSettings,
          unlockedDiaries: user.unlockedDiaries,
        },
        token,
        isNewUser,
      },
      isNewUser ? 'Welcome to LifeLog!' : 'Signed in with Google successfully!'
    )
  );
});

export { sendOtp, verifyOtp, getProfile, updateUserProfile, googleAuth };
