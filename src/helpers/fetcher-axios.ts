import axios from "axios";

export const apiClient = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
        'content-type': 'application/json',
    },
    withCredentials: true
});

export const fetcherAxios = (url: string) => apiClient.get(url).then(res => res.data);