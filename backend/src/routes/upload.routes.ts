import { Router } from 'express';
import { uploadSingle, uploadMultiple, deleteImage } from '../controllers/upload.controller';
import { authenticate, requireAdmin } from '../middlewares/auth.middleware';
import { uploadMiddleware } from '../middlewares/upload.middleware';

const router = Router();

router.post('/single', authenticate, uploadMiddleware.single('image'), uploadSingle);
router.post('/multiple', authenticate, uploadMiddleware.array('images', 10), uploadMultiple);
router.delete('/:publicId', authenticate, requireAdmin, deleteImage);

export default router;
