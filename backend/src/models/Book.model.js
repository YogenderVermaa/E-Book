import mongoose from 'mongoose';

const chapterSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    content: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export const Chapter = mongoose.model('Chapter', chapterSchema);

const bookSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
      default: '',
    },
    author: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String,
      default: '',
    },
    chapters: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chapter',
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
    },
  },
  {
    timestamps: true,
  }
);
export const Book = mongoose.model('Book', bookSchema);
