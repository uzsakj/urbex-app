import api from "../../lib/axios";


export const searchUsers = async (query: string) => {
    const response = await api.get(`api/users/search?q=${encodeURIComponent(query)}`);
    return response.data;
};


export const searchLocations = async (query: string) => {
    const response = await api.get(`api/location/search?q=${encodeURIComponent(query)}`);
    return response.data;
};
