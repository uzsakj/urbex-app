import { httpClient } from './httpClient';
import { ProfileDto } from './dto/profile.dto';

const getToken = () => localStorage.getItem('authToken');

export const getProfile = async () => {
    return await httpClient('/api/profile', 'GET', undefined, getToken()!);
};

export const updateProfile = async (profile: ProfileDto) => {
    return await httpClient('/api/profile', 'POST', profile, getToken()!);
};
