import api from './api';

const reviewService = {
  // Get reviews for an experience
  getExperienceReviews: async (experienceId, page = 1, limit = 10) => {
    try {
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', limit);
      
      const response = await api.get(`/reviews/experience/${experienceId}?${params.toString()}`);
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch reviews');
    }
  },

  // Create a review
  createReview: async (reviewData) => {
    try {
      const response = await api.post('/reviews', reviewData);
      return response.data.data.review;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create review');
    }
  },

  // Update a review
  updateReview: async (reviewId, reviewData) => {
    try {
      const response = await api.put(`/reviews/${reviewId}`, reviewData);
      return response.data.data.review;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update review');
    }
  },

  // Delete a review
  deleteReview: async (reviewId) => {
    try {
      const response = await api.delete(`/reviews/${reviewId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete review');
    }
  },

  // Get user's reviews (reviews they wrote)
  getUserReviews: async (page = 1, limit = 10) => {
    try {
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', limit);
      
      const response = await api.get(`/reviews/user?${params.toString()}`);
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch user reviews');
    }
  },

  // Get reviews received by host
  getHostReviews: async (page = 1, limit = 10) => {
    try {
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', limit);
      
      const response = await api.get(`/reviews/host?${params.toString()}`);
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch host reviews');
    }
  },

  // Mark review as helpful
  markHelpful: async (reviewId) => {
    try {
      const response = await api.post(`/reviews/${reviewId}/helpful`);
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to mark review as helpful');
    }
  },

  // Report a review
  reportReview: async (reviewId, reason) => {
    try {
      const response = await api.post(`/reviews/${reviewId}/report`, { reason });
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to report review');
    }
  },
};

export default reviewService;