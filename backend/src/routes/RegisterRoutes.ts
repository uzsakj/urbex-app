import express from 'express';
import { handleRegister } from '../controllers/RegisterController.ts';

const router = express.Router();

router.post('/', handleRegister);

export default router;
