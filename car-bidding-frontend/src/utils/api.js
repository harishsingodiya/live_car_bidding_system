import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

// Add Authorization token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // Retrieve token from localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const createUser = (username) => api.post('/users', { username });
export const createAuction = (formData) => api.post('/auctions', {...formData});
export const getAuctions = () => api.get('/auctions');
export const getAuctionById = (auctionId) => api.get(`/auctions/${auctionId}`)
export const endAuction = (auctionId) => api.post(`/auctions/${auctionId}/end`);
export const getAuctionBids = (auctionId) => api.get(`/auctions/${auctionId}/bids`);
export const loginUser = (username, password) => api.post('/login', { username, password });
export const refreshTokenApi = (refreshToken) => api.post(`/refresh-token`, { refreshToken });
export const registerUser = (username, password) => api.post('/register', { username, password });
