import api from './api';

const bookingService = {
  // Get user's bookings
  getBookings: async (page = 1, limit = 10, status = null) => {
    try {
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', limit);
      if (status) params.append('status', status);
      
      const response = await api.get(`/bookings?${params.toString()}`);
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch bookings');
    }
  },

  // Get single booking by ID
  getBooking: async (bookingId) => {
    try {
      const response = await api.get(`/bookings/${bookingId}`);
      return response.data.data.booking;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch booking');
    }
  },

  // Create new booking
  createBooking: async (bookingData) => {
    try {
      const response = await api.post('/bookings', bookingData);
      return response.data.data.booking;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create booking');
    }
  },

  // Update booking status (hosts only)
  updateBookingStatus: async (bookingId, status, message = null) => {
    try {
      const response = await api.patch(`/bookings/${bookingId}/status`, {
        status,
        message,
      });
      return response.data.data.booking;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update booking status');
    }
  },

  // Cancel booking
  cancelBooking: async (bookingId, reason = null) => {
    try {
      const response = await api.patch(`/bookings/${bookingId}/cancel`, {
        reason,
      });
      return response.data.data.booking;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to cancel booking');
    }
  },

  // Get host's bookings
  getHostBookings: async (page = 1, limit = 10, status = null) => {
    try {
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', limit);
      if (status) params.append('status', status);
      
      const response = await api.get(`/bookings/host?${params.toString()}`);
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch host bookings');
    }
  },

  // Check availability for experience
  checkAvailability: async (experienceId, checkIn, checkOut, guests) => {
    try {
      const response = await api.post('/bookings/check-availability', {
        experienceId,
        checkIn,
        checkOut,
        guests,
      });
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to check availability');
    }
  },
};

export default bookingService;