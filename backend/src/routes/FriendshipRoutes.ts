import express from 'express';
import {
    handleSendFriendRequest,
    handleRespondToFriendRequest,
    handleGetFriendsOfUser,
    handleDeleteFriendship,
} from '../controllers/FriendshipController.ts';
import { authenticateJWT } from '../middleware/auth.ts';

const router = express.Router();
router.use(authenticateJWT);

router.post('/request', handleSendFriendRequest);
router.patch('/respond/:friendshipId', handleRespondToFriendRequest);
router.get('/:userId', handleGetFriendsOfUser);
router.delete('/:friendshipId', handleDeleteFriendship);


export default router;
