import { Book, Chapter } from '../models/Book.model.js';
import { ApiError } from '../utils/api-error.js';
import { ApiResponse } from '../utils/api-response.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';

// CREATE BOOK
const createBook = asyncHandler(async (req, res) => {
  const { title, author, subtitle, chapters } = req.body;

  if (!title || !author) {
    throw new ApiError(400, "title and author's name required");
  }

  if (!Array.isArray(chapters) || chapters.length === 0) {
    throw new ApiError(400, 'chapters array is required');
  }

  const chapterDocs = await Promise.all(
    chapters.map(async (ch) => {
      return Chapter.create({
        title: ch.title,
        description: ch.description || '',
        content: ch.content || '',
      });
    })
  );

  // Get chapter IDs
  const chapterIds = chapterDocs.map((c) => c._id);

  // Create book
  const book = await Book.create({
    userId: req.user._id,
    title,
    author,
    subtitle,
    chapters: chapterIds,
  });

  return res.status(201).json(new ApiResponse(201, { book }, 'Book created successfully'));
});

// GET ALL BOOKS
const getBooks = asyncHandler(async (req, res) => {
  const books = await Book.find({ userId: req.user?._id }).sort({ createdAt: -1 });

  return res.status(200).json(new ApiResponse(200, books, 'Books fetched successfully'));
});

// GET BOOK BY ID
const getBookById = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id).populate('chapters'); // ✅ FIXED

  if (!book) {
    throw new ApiError(404, 'Book not found');
  }

  if (book.userId.toString() !== req.user._id.toString()) {
    throw new ApiError(401, 'Not authorized to see this book');
  }

  return res.status(200).json(new ApiResponse(200, book, 'Book fetched successfully'));
});

// UPDATE BOOK
const updateBook = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);

  if (!book) throw new ApiError(404, 'Book not found');

  if (book.userId.toString() !== req.user._id.toString()) {
    throw new ApiError(401, 'Not authorized to update this book');
  }

  const { chapters, ...bookData } = req.body;
  if (chapters && Array.isArray(chapters)) {
    await Promise.all(
      chapters.map(async (ch) => {
        if (ch._id) {
          await Chapter.findByIdAndUpdate(ch._id, {
            title: ch.title,
            desctiption: ch.description,
            content: ch.content,
          });
        }
      })
    );
  }
  const updatedBook = await Book.findByIdAndUpdate(req.params.id, bookData, {
    new: true,
  }).populate('chapters');

  return res.status(200).json(new ApiResponse(200, updatedBook, 'Book updated successfully'));
});

// UPDATE COVER
const updateCover = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) throw new ApiError(404, 'Book not found');

  if (book.userId.toString() !== req.user._id.toString()) {
    throw new ApiError(401, 'Not authorized');
  }

  if (!req.file) {
    throw new ApiError(400, 'Cover image required');
  }
  const coverImageLocalPath = req.file.path;
  const normalizedCoverPath = coverImageLocalPath?.replace(/\\/g, '/');
  if (!normalizedCoverPath) {
    throw new ApiError(400, 'avatar file is missing');
  }
  let coverImage;
  try {
    coverImage = await uploadOnCloudinary(normalizedCoverPath);
  } catch (err) {
    console.log('Error uploading coverImage', err);
    throw new ApiError(500, 'Failed to upload coverImage');
  }

  const updatedCover = await Book.findByIdAndUpdate(
    req.params.id,
    { coverImage: coverImage?.url },
    { new: true }
  );

  return res.status(200).json(new ApiResponse(200, updatedCover, 'Cover updated successfully'));
});

// DELETE BOOK
const deleteBook = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id); // ✅ FIXED
  if (!book) throw new ApiError(404, 'Book not found');

  if (book.userId.toString() !== req.user._id.toString()) {
    throw new ApiError(401, 'Not authorized');
  }

  await book.deleteOne();

  return res.status(200).json(new ApiResponse(200, null, 'Book deleted successfully'));
});

export { createBook, updateBook, getBooks, updateCover, deleteBook, getBookById };
