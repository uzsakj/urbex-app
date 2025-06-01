import { Profile } from './types';
import api from '../../lib/axios';

export const getProfile = async (): Promise<Profile> => {
    const response = await api.get('/api/profile');
    return response.data.data;
};

export const updateProfile = async (profile: Partial<Profile>): Promise<void> => {
    await api.patch('/api/profile', profile);
};
