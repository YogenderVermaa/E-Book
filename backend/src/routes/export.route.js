import { Router } from 'express';
import { verifyJWT } from '../middleware/auth.middleware.js';
import { exportBookDocx, exportBookPdf } from '../controller/export.controller.js';
const router = Router();

router.use(verifyJWT);

router.route('/:id/pdf').get(exportBookPdf);
router.route('/:id/doc').get(exportBookDocx);

export default router;
