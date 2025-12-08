import { Book } from '../models/Book.model.js';
import { ApiError } from '../utils/api-error.js';
import { ApiResponse } from '../utils/api-response.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const createBook = asyncHandler(async (req, res) => {
  const { title, author, subtitle, chapters } = req.body;
  if (!title || !author) {
    throw new ApiError(400, 'title and authors name required');
  }

  const book = await Book.create({
    userId: req.user_id,
    title,
    author,
    subtitle,
    chapters,
  });

  if (!book) {
    throw new ApiError(500, 'Something went wrong while createing book');
  }

  return res.status(201, book, 'Book created SuccessFully');
});

const getBooks = asyncHandler(async (req, res) => {
  const books = (await Book.find({ userId: req.user?._id })).toSorted({ createdAt: -1 });
  if (!books) {
    throw new ApiError(404, 'NO books found');
  }

  return res.status(200, books, 'fatched books successfully');
});
const getBookById = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);

  if (!book) {
    throw new ApiError(404, 'Book not found');
  }

  if (book.userId.toString() !== req.user._id.toString()) {
    throw new ApiError(401, 'Not authorized to see this book');
  }

  return res.json(200, book, 'Book fatched successfully');
});

const updateBook = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) {
    throw new ApiError(404, 'Book not found');
  }

  if (book.userId.toString() !== req.user._id.toString()) {
    throw new ApiError(401, 'Not authorized to update this book');
  }

  const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  if (!updatedBook) {
    throw new ApiError('400', 'Book update failed');
  }

  return res.status(200).json(new ApiResponse(200, updatedBook, 'Book updated successfully'));
});

const updateCover = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params?.id);
  if (!book) {
    throw new ApiError(404, 'Book not found');
  }

  if (book.userId.toString !== req.user._id.toString()) {
    throw new ApiError(401, 'Not authrized to update this book');
  }

  if (!req.file) {
    throw new ApiError(400, 'Cover image required');
  }

  const updatedCover = await Book.findByIdAndUpdate(
    req.params.id,
    {
      coverImage: req.file.path,
    },
    {
      new: true,
    }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updatedCover, 'Cover Image Updated Successfully'));
});

const deleteBook = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.param?.id);
  if (!book) {
    throw new ApiError(404, 'Book not found');
  }

  if (book.userId.toString() !== req.user?._id.toString()) {
    throw new ApiError(401, 'Not authorized to delete this book');
  }

  await book.deleteOne();

  return res.status(200).json(new ApiResponse(200, null, 'Book Deleted Successfully'));
});

export { createBook, updateBook, getBooks, updateCover, deleteBook, getBookById };
