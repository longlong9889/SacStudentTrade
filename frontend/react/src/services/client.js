import axios from 'axios';

const API = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
});

// Attach JWT to every request
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const getAuthToken = () => localStorage.getItem('access_token');

// ──── Auth ────
export const login = (usernameAndPassword) =>
    API.post('/api/v1/auth/login', usernameAndPassword);

// ──── Customers ────
export const getCustomers = () =>
    API.get('/api/v1/customers');

export const getCustomer = (id) =>
    API.get(`/api/v1/customers/${id}`);

export const saveCustomer = (customer) =>
    API.post('/api/v1/customers', customer);

export const updateCustomer = (id, update) =>
    API.put(`/api/v1/customers/${id}`, update);

export const deleteCustomer = (id) =>
    API.delete(`/api/v1/customers/${id}`);

export const uploadCustomerProfileImage = (id, formData) =>
    API.post(`/api/v1/customers/${id}/profile-image`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });

export const customerProfilePictureUrl = (id) =>
    `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/api/v1/customers/${id}/profile-image`;

// ──── Items ────
export const getAllItems = () =>
    API.get('/api/v1/items');

export const getAvailableItems = () =>
    API.get('/api/v1/items/available');

export const getItem = (id) =>
    API.get(`/api/v1/items/${id}`);

export const getItemsBySeller = (sellerId) =>
    API.get(`/api/v1/items/seller/${sellerId}`);

export const getItemsByCategory = (category) =>
    API.get(`/api/v1/items/category/${category}`);

export const searchItems = (query) =>
    API.get('/api/v1/items/search', { params: { q: query } });

export const getItemsByPriceRange = (min, max) =>
    API.get('/api/v1/items/price-range', { params: { min, max } });

export const createItem = (sellerId, itemData) =>
    API.post(`/api/v1/items/seller/${sellerId}`, itemData);

export const updateItem = (itemId, updateData) =>
    API.put(`/api/v1/items/${itemId}`, updateData);

export const deleteItem = (itemId) =>
    API.delete(`/api/v1/items/${itemId}`);

export const uploadItemImage = (itemId, formData) =>
    API.post(`/api/v1/items/${itemId}/image`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });

export const itemImageUrl = (itemId) =>
    `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/api/v1/items/${itemId}/image`;

export const markItemSold = (itemId) =>
    API.patch(`/api/v1/items/${itemId}/mark-sold`);

export const markItemAvailable = (itemId) =>
    API.patch(`/api/v1/items/${itemId}/mark-available`);

// ──── Messages ────
export const getMessagesForUser = (userId) =>
    API.get(`/api/v1/messages/user/${userId}`);

export const getConversation = (userId1, userId2) =>
    API.get('/api/v1/messages/conversation', { params: { user1: userId1, user2: userId2 } });

export const getUnreadMessages = (userId) =>
    API.get(`/api/v1/messages/unread/${userId}`);

export const getUnreadMessageCount = (userId) =>
    API.get(`/api/v1/messages/unread/count/${userId}`);

export const sendMessage = (senderId, messageData) =>
    API.post(`/api/v1/messages/send/${senderId}`, messageData);

export const markMessageRead = (messageId) =>
    API.patch(`/api/v1/messages/${messageId}/read`);

export const markAllMessagesRead = (userId, otherUserId) =>
    API.patch('/api/v1/messages/mark-all-read', null, {
        params: { userId, otherUserId },
    });

export const deleteMessage = (messageId) =>
    API.delete(`/api/v1/messages/${messageId}`);

// ──── Favorites ────
export const getFavorites = (customerId) =>
    API.get(`/api/v1/favorites/customer/${customerId}`);

export const isFavorited = (customerId, itemId) =>
    API.get('/api/v1/favorites/check', { params: { customerId, itemId } });

export const getFavoriteCount = (itemId) =>
    API.get(`/api/v1/favorites/count/${itemId}`);

export const addFavorite = (customerId, itemId) =>
    API.post('/api/v1/favorites', null, { params: { customerId, itemId } });

export const removeFavorite = (customerId, itemId) =>
    API.delete('/api/v1/favorites', { params: { customerId, itemId } });

export const toggleFavorite = (customerId, itemId) =>
    API.post('/api/v1/favorites/toggle', null, { params: { customerId, itemId } });

export default API;
