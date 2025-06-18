import api from '../../lib/axios';
import { Friendship, FriendshipStatus } from './types';

export const sendFriendRequest = async (recipientId: string): Promise<Friendship> => {
    const response = await api.post('/api/friends/request', { recipientId });
    return response.data.data;
};

export const respondToFriendRequest = async (friendshipId: string, status: FriendshipStatus): Promise<Friendship> => {
    const response = await api.patch(`/api/friends/respond/${friendshipId}`, { status });
    return response.data.data;
};

export const fetchFriendsOfUser = async (userId: string): Promise<Friendship[]> => {
    const response = await api.get(`/api/friends/${userId}`);
    return response.data.data;
};

export const deleteFriendship = async (friendshipId: string): Promise<void> => {
    await api.delete(`/api/friends/${friendshipId}`);
};
