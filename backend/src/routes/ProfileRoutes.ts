import express from 'express';
import { handleUpdateProfile, handleDeleteProfile, handleGetProfile } from '../controllers/ProfileController.ts';
import { authenticateJWT } from '../middleware/auth.ts';
import multer from 'multer';

const router = express.Router();

router.use(authenticateJWT);
const storage = multer.diskStorage({
    destination: 'uploads/avatars/',
    filename: (_req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});

const upload = multer({ storage });

router.get('/:userId', handleGetProfile);
router.patch('/', upload.single('avatar'), handleUpdateProfile);
router.delete('/', handleDeleteProfile);

export default router;
