import api from './api';

const userService = {
  // Get user profile by ID
  getUserProfile: async (userId) => {
    try {
      const response = await api.get(`/users/${userId}`);
      return response.data.data.user;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch user profile');
    }
  },

  // Get user dashboard data
  getDashboard: async () => {
    try {
      const response = await api.get('/users/dashboard');
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch dashboard data');
    }
  },

  // Update user preferences
  updatePreferences: async (preferences) => {
    try {
      const response = await api.put('/users/preferences', preferences);
      return response.data.data.user;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update preferences');
    }
  },

  // Get user's favorites
  getFavorites: async () => {
    try {
      const response = await api.get('/users/favorites');
      return response.data.data.favorites;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch favorites');
    }
  },

  // Add experience to favorites
  addToFavorites: async (experienceId) => {
    try {
      const response = await api.post('/users/favorites', { experienceId });
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to add to favorites');
    }
  },

  // Remove experience from favorites
  removeFromFavorites: async (experienceId) => {
    try {
      const response = await api.delete(`/users/favorites/${experienceId}`);
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to remove from favorites');
    }
  },
};

export default userService;