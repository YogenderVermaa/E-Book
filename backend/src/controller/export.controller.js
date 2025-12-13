import { Book } from '../models/Book.model.js';
import { ApiError } from '../utils/api-error.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { generateDocx } from '../utils/generateDocx.js';
import { generatePdf } from '../utils/generatePdf.js';

const exportBookDocx = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id).populate('chapters');

  if (!book) {
    throw new ApiError(404, 'Book not found');
  }

  const buffer = await generateDocx(book, book.chapters);
  res.setHeader(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  );

  res.setHeader(
    'Content-Disposition',
    `attachment; filename="${book.title.replace(/[^a-zA-Z0-9]/g, '_')}.docx"`
  );

  res.send(buffer);
});

const exportBookPdf = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id).populate('chapters');

  if (!book) {
    throw new ApiError(404, 'Book not found');
  }

  const pdfBuffer = await generatePdf(book, book.chapters);
  console.log(book.chapters);
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="${book.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf"`
  );
  res.send(pdfBuffer);
});

export { exportBookDocx, exportBookPdf };
