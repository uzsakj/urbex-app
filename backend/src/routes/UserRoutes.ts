import express from 'express';
import { handleSearchUsers } from '../controllers/UserController.ts';
import { authenticateJWT } from '../middleware/auth.ts';

const router = express.Router();
router.use(authenticateJWT);

router.get('/search', handleSearchUsers);

export default router;
