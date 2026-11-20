import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: '',
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    googleId: {
      type: String,
      default: '',
      index: true,
    },
    password: {
      type: String,
      select: false,
    },
    avatar: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      default: 'Sharing my daily life journey through written vlogs and personal diaries.',
    },
    isPro: {
      type: Boolean,
      default: false,
    },
    unlockedDiaries: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
      },
    ],
    subscriptions: [
      {
        diaryId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Book',
          required: true,
        },
        planType: {
          type: String,
          enum: ['weekly', 'monthly', 'annual', 'lifetime'],
          default: 'monthly',
        },
        startDate: {
          type: Date,
          default: Date.now,
        },
        expiresAt: {
          type: Date,
          required: true,
        },
        paymentId: {
          type: String,
          default: '',
        },
        status: {
          type: String,
          enum: ['active', 'expired'],
          default: 'active',
        },
      },
    ],
    payoutSettings: {
      payoutMethod: {
        type: String,
        enum: ['upi', 'bank'],
        default: 'upi',
      },
      upiId: {
        type: String,
        default: '',
        trim: true,
      },
      accountHolderName: {
        type: String,
        default: '',
        trim: true,
      },
      accountNumber: {
        type: String,
        default: '',
        trim: true,
      },
      ifscCode: {
        type: String,
        default: '',
        trim: true,
      },
      bankName: {
        type: String,
        default: '',
        trim: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.generateToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
    },
    process.env.JWT_SECRET || 'secretkeyfallback',
    {
      expiresIn: '30d',
    }
  );
};

const User = mongoose.model('User', userSchema);

export { User };
