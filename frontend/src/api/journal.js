import axiosInstance from './axiosInstance';

export const updateEntry = async (id, data) => {
    const response = await axiosInstance.put(`/entries/${id}/`, data);
    return response.data;
};
