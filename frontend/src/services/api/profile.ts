import { httpClient } from './httpClient';
const getToken = () => localStorage.getItem('authToken') || '';
export const getProfile = async () => {
    const { data } = await httpClient('/api/profile', 'GET', undefined, getToken());
    return data;
};

export const createProfile = async (formData: FormData) => {
    return httpClient('/api/profile', 'POST', formData, getToken());
};

export const updateProfile = async (formData: FormData) => {
    return httpClient('/api/profile', 'PATCH', formData, getToken());
};
