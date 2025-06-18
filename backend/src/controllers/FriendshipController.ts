import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.ts';
import { FriendshipService } from '../services/FriendshipService.ts';
import { UserService } from '../services/UserService.ts';
import { httpResponse } from '../utils/httpResponse.ts';
import { NotificationService } from '../services/NotificationService.ts';
import { ProfileService } from '../services/ProfileService.ts';

const userService = new UserService();
const notificationService = new NotificationService();
const profileService = new ProfileService();
const friendshipService = new FriendshipService(userService, notificationService, profileService);


export const handleSendFriendRequest = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { recipientId } = req.body;
        const requesterId = req.user.id;

        const friendship = await friendshipService.sendFriendRequest(requesterId, recipientId);
        return httpResponse(201, 'Friend request sent', friendship, res);
    } catch (error) {
        console.error(error);
        return httpResponse(400, `Failed to send friend request:${error}`, null, res);
    }
};


export const handleRespondToFriendRequest = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { friendshipId } = req.params;
        const { status } = req.body;
        const updated = await friendshipService.respondToRequest(friendshipId, status);
        return httpResponse(200, `Friend request ${status}`, updated, res);
    } catch (error) {
        console.error(error);
        return httpResponse(400, `Failed to respond to friend request :${error}`, null, res);
    }
};

export const handleGetFriendsOfUser = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.params.userId === 'me' ? req.user.id : req.params.userId;
        const requestingUserId = req.user.id;

        const targetUser = await userService.getUserById(userId);
        if (!targetUser) {
            return httpResponse(404, 'User not found', {}, res);
        }

        const isSelf = requestingUserId === userId;

        const visibility = targetUser.friendListVisibility || 'public';

        if (visibility === 'private' && !isSelf) {
            return httpResponse(403, 'This user has hidden their friends list', null, res);
        }

        if (visibility === 'friends' && !isSelf) {
            const isFriend = await friendshipService.areUsersFriends(requestingUserId, userId);
            if (!isFriend) {
                return httpResponse(403, 'Only friends can see this user’s friends list', {}, res);
            }
        }

        const friends = await friendshipService.getFriendsOfUser(userId, requestingUserId);
        return httpResponse(200, 'Friends list retrieved', friends, res);

    } catch (error) {
        console.error(error);
        return httpResponse(500, `Failed to retrieve friends list: :${error}`, null, res);
    }
};

export const handleDeleteFriendship = async (req: AuthenticatedRequest, res: Response) => {
    try {

        const { friendshipId } = req.params;

        await friendshipService.deleteFriendship(friendshipId)
        return httpResponse(200, 'Friendship deleted successfully', null, res);
    } catch (error) {
        return httpResponse(500, `Failed to delete friendship :${error}`, null, res);
    }
}
