const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // ==================== AUTH ENDPOINTS ====================
  async signup(userData) {
    return this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async getProfile() {
    return this.request('/auth/profile');
  }

  async updateProfile(userData) {
    return this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async forgotPassword(email) {
    return this.request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async verifyOTP(email, otp) {
    return this.request('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    });
  }

  async resetPassword(email, otp, newPassword) {
    return this.request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email, otp, newPassword }),
    });
  }

  // ==================== PROPERTY ENDPOINTS ====================
  async getAllProperties(filters = {}) {
    const queryParams = new URLSearchParams();
    if (filters.city) queryParams.append('city', filters.city);
    if (filters.minPrice) queryParams.append('minPrice', filters.minPrice);
    if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice);
    if (filters.bhk) queryParams.append('bhk', filters.bhk);
    if (filters.type) queryParams.append('type', filters.type);
    if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);

    const query = queryParams.toString();
    return this.request(`/properties${query ? '?' + query : ''}`);
  }

  async getPropertyById(id) {
    return this.request(`/properties/${id}`);
  }

  async createProperty(propertyData) {
    return this.request('/properties', {
      method: 'POST',
      body: JSON.stringify(propertyData),
    });
  }

  async updateProperty(id, propertyData) {
    return this.request(`/properties/${id}`, {
      method: 'PUT',
      body: JSON.stringify(propertyData),
    });
  }

  async deleteProperty(id) {
    return this.request(`/properties/${id}`, {
      method: 'DELETE',
    });
  }

  async getOwnerProperties() {
    return this.request('/properties/owner/my-properties');
  }

  async searchProperties(query) {
    return this.request(`/properties/search?q=${encodeURIComponent(query)}`);
  }

  // ==================== BOOKING ENDPOINTS ====================
  async createBooking(bookingData) {
    return this.request('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  }

  async getMyBookings() {
    return this.request('/bookings/my-bookings');
  }

  async getBookingById(id) {
    return this.request(`/bookings/${id}`);
  }

  async cancelBooking(id) {
    return this.request(`/bookings/${id}/cancel`, {
      method: 'PUT',
    });
  }

  async getOwnerBookings() {
    return this.request('/bookings/owner/bookings');
  }

  async updateBookingStatus(id, status) {
    return this.request(`/bookings/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  // ==================== SAVED PROPERTIES ENDPOINTS ====================
  async getSavedProperties() {
    return this.request('/saved-properties');
  }

  async saveProperty(propertyId) {
    return this.request('/saved-properties', {
      method: 'POST',
      body: JSON.stringify({ propertyId }),
    });
  }

  async unsaveProperty(propertyId) {
    return this.request(`/saved-properties/${propertyId}`, {
      method: 'DELETE',
    });
  }

  // ==================== PAYMENT ENDPOINTS ====================
  async createPaymentOrder(orderData) {
    return this.request('/payments/create-order', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async verifyPayment(paymentData) {
    return this.request('/payments/verify', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  }

  // ==================== CONTACT ENDPOINT ====================
  async submitContactForm(formData) {
    return this.request('/contact', {
      method: 'POST',
      body: JSON.stringify(formData),
    });
  }

  // ==================== ADMIN ENDPOINTS ====================
  async getAdminStats() {
    return this.request('/admin/stats');
  }

  async getAllUsers(filters = {}) {
    const queryParams = new URLSearchParams();
    if (filters.role) queryParams.append('role', filters.role);
    if (filters.search) queryParams.append('search', filters.search);
    if (filters.page) queryParams.append('page', filters.page);
    if (filters.limit) queryParams.append('limit', filters.limit);

    const query = queryParams.toString();
    return this.request(`/admin/users${query ? '?' + query : ''}`);
  }

  async getUserById(id) {
    return this.request(`/admin/users/${id}`);
  }

  async updateUser(id, userData) {
    return this.request(`/admin/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id) {
    return this.request(`/admin/users/${id}`, {
      method: 'DELETE',
    });
  }

  async getAdminProperties(filters = {}) {
    const queryParams = new URLSearchParams();
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.city) queryParams.append('city', filters.city);
    if (filters.page) queryParams.append('page', filters.page);
    if (filters.limit) queryParams.append('limit', filters.limit);

    const query = queryParams.toString();
    return this.request(`/admin/properties${query ? '?' + query : ''}`);
  }

  async deletePropertyAdmin(id) {
    return this.request(`/admin/properties/${id}`, {
      method: 'DELETE',
    });
  }

  async getAdminBookings(filters = {}) {
    const queryParams = new URLSearchParams();
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.page) queryParams.append('page', filters.page);
    if (filters.limit) queryParams.append('limit', filters.limit);

    const query = queryParams.toString();
    return this.request(`/admin/bookings${query ? '?' + query : ''}`);
  }
}

export default new ApiService();
