import { Router } from 'express';
import { verifyJWT } from '../middleware/auth.middleware.js';
import {
  createBook,
  updateBook,
  getBooks,
  updateCover,
  deleteBook,
  getBookById,
} from '../controller/book.controller.js';
import upload from '../middleware/upload.middleware.js';

const router = Router();

router.use(verifyJWT);

router.route('/').post(createBook).get(getBooks);
router.route('/:id').get(getBookById).put(updateBook).delete(deleteBook);
router.route('/cover/:id').put(upload, updateCover);

export default router;
