import { Router } from 'express';
import { generateOutline, generateChapterContent } from '../controller/aiController.js';
import { verifyJWT } from '../middleware/auth.middleware.js';
const router = Router();

router.use(verifyJWT);

router.route('/generate-outline').post(generateOutline);
router.route('/generate-content').post(generateChapterContent);

export default router;
