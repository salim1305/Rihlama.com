import api from './api';

const experienceService = {
  // Get all experiences with optional filters
  getExperiences: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      // Add filters as query parameters
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
          params.append(key, filters[key]);
        }
      });
      
      const response = await api.get(`/experiences?${params.toString()}`);
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch experiences');
    }
  },

  // Get single experience by ID
  getExperience: async (id) => {
    try {
      const response = await api.get(`/experiences/${id}`);
      return response.data.data.experience;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch experience');
    }
  },

  // Create new experience (hosts only)
  createExperience: async (experienceData) => {
    try {
      const response = await api.post('/experiences', experienceData);
      return response.data.data.experience;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create experience');
    }
  },

  // Update experience (hosts only)
  updateExperience: async (id, experienceData) => {
    try {
      const response = await api.put(`/experiences/${id}`, experienceData);
      return response.data.data.experience;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update experience');
    }
  },

  // Delete experience (hosts only)
  deleteExperience: async (id) => {
    try {
      const response = await api.delete(`/experiences/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete experience');
    }
  },

  // Get host's experiences
  getHostExperiences: async () => {
    try {
      const response = await api.get('/experiences/host/my-experiences');
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch host experiences');
    }
  },

  // Search experiences
  searchExperiences: async (searchQuery, filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
          params.append(key, filters[key]);
        }
      });
      
      const response = await api.get(`/experiences/search?${params.toString()}`);
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to search experiences');
    }
  },

  // Get featured experiences
  getFeaturedExperiences: async (limit = 4) => {
    try {
      const response = await api.get(`/experiences?featured=true&limit=${limit}`);
      return response.data.data.experiences || [];
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch featured experiences');
    }
  },

  // Get experiences by category
  getExperiencesByCategory: async (category, limit = 10) => {
    try {
      const response = await api.get(`/experiences?category=${category}&limit=${limit}`);
      return response.data.data.experiences || [];
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch experiences by category');
    }
  },
};

export default experienceService;