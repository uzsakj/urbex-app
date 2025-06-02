import express from 'express';
import { getProfile, updateProfile, deleteProfile } from '../controllers/ProfileController.ts';
import { authenticateJWT } from '../middleware/auth.ts';

const router = express.Router();

router.use(authenticateJWT);

router.get('/', getProfile);
router.put('/', updateProfile);
router.delete('/', deleteProfile);

export default router;
