import express from 'express';
import { handleLogin } from '../controllers/LoginController.ts';

const router = express.Router();

router.post('/', handleLogin);

export default router;
