import { httpClient } from './httpClient';
const getToken = () => localStorage.getItem('authToken') || '';

export const getLocation = async () => {
    const { data } = await httpClient('/api/location', 'GET', undefined, getToken());
    return data;
};

export const createLocation = async (formData: FormData) => {
    return httpClient('/api/location', 'POST', formData, getToken());
};

export const updateLocation = async (formData: FormData) => {
    return httpClient('/api/location', 'PATCH', formData, getToken());
};

export const deleteLocation = async (formData: FormData) => {
    return httpClient('/api/location', 'PATCH', formData, getToken());
};
