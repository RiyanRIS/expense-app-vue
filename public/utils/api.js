// API utility functions
const API_BASE_URL = '';

const apiClient = {
  // Get auth token
  getToken() {
    return localStorage.getItem('token');
  },

  // Get headers with auth token
  getHeaders(includeAuth = true) {
    const headers = {
      'Content-Type': 'application/json'
    };
    
    if (includeAuth) {
      const token = this.getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }
    
    return headers;
  },

  // Generic request handler
  async request(url, options = {}) {
    try {
      const response = await fetch(url, options);
      
      // Try to parse JSON response
      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        // If response is not JSON, create error object
        data = { message: 'Invalid server response' };
      }
      
      if (!response.ok) {
        // Create error with proper message from server
        const error = data.message || data.error || `Request failed with status ${response.status}`;
        error.status = response.status;
        error.data = data;

        throw error;
      }
      
      return data;
    } catch (error) {
      // If it's a network error (fetch failed)
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        const networkError = new Error('Gagal terhubung ke server. Periksa koneksi internet Anda');
        networkError.isNetworkError = true;
        throw networkError;
      }
      
      // Re-throw the error with all its properties intact
      throw error;
    }
  },

  // Auth endpoints
  auth: {
    async signup(userData) {
      return apiClient.request(`${API_BASE_URL}/api/auth/signup`, {
        method: 'POST',
        headers: apiClient.getHeaders(false),
        body: JSON.stringify(userData)
      });
    },

    async login(credentials) {
      return apiClient.request(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: apiClient.getHeaders(false),
        body: JSON.stringify(credentials)
      });
    },

    async logout() {
      return apiClient.request(`${API_BASE_URL}/api/auth/logout`, {
        method: 'POST',
        headers: apiClient.getHeaders()
      });
    },

    async getMe() {
      return apiClient.request(`${API_BASE_URL}/api/auth/me`, {
        headers: apiClient.getHeaders()
      });
    },

    async updateProfile(profileData) {
      return apiClient.request(`${API_BASE_URL}/api/auth/profile`, {
        method: 'PUT',
        headers: apiClient.getHeaders(),
        body: JSON.stringify(profileData)
      });
    },

    async changePassword(passwordData) {
      return apiClient.request(`${API_BASE_URL}/api/auth/change-password`, {
        method: 'PUT',
        headers: apiClient.getHeaders(),
        body: JSON.stringify(passwordData)
      });
    },

    async forgotPassword(email) {
      return apiClient.request(`${API_BASE_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: apiClient.getHeaders(false),
        body: JSON.stringify({ email })
      });
    },

    async resetPassword(token, password) {
      return apiClient.request(`${API_BASE_URL}/api/auth/reset-password/${token}`, {
        method: 'POST',
        headers: apiClient.getHeaders(false),
        body: JSON.stringify({ password })
      });
    },

    async deleteAccount(deleteData) {
      return apiClient.request(`${API_BASE_URL}/api/auth/account`, {
        method: 'DELETE',
        headers: apiClient.getHeaders(),
        body: JSON.stringify(deleteData)
      });
    },

    async reactivateAccount(credentials) {
      return apiClient.request(`${API_BASE_URL}/api/auth/reactivate`, {
        method: 'POST',
        headers: apiClient.getHeaders(false),
        body: JSON.stringify(credentials)
      });
    }
  },

  // Expenses endpoints
  expenses: {
    async getAll() {
      return apiClient.request(`${API_BASE_URL}/api/expenses`, {
        headers: apiClient.getHeaders()
      });
    },

    async getById(id) {
      return apiClient.request(`${API_BASE_URL}/api/expenses/${id}`, {
        headers: apiClient.getHeaders()
      });
    },

    async create(expenseData) {
      return apiClient.request(`${API_BASE_URL}/api/expenses`, {
        method: 'POST',
        headers: apiClient.getHeaders(),
        body: JSON.stringify(expenseData)
      });
    },

    async update(id, expenseData) {
      return apiClient.request(`${API_BASE_URL}/api/expenses/${id}`, {
        method: 'PUT',
        headers: apiClient.getHeaders(),
        body: JSON.stringify(expenseData)
      });
    },

    async delete(id) {
      return apiClient.request(`${API_BASE_URL}/api/expenses/${id}`, {
        method: 'DELETE',
        headers: apiClient.getHeaders()
      });
    }
  },

  // Categories endpoints
  categories: {
    async getAll(type = null) {
      const url = type 
        ? `${API_BASE_URL}/api/categories?type=${type}`
        : `${API_BASE_URL}/api/categories`;
      return apiClient.request(url, {
        headers: apiClient.getHeaders()
      });
    },

    async create(name, type = 'expense') {
      return apiClient.request(`${API_BASE_URL}/api/categories`, {
        method: 'POST',
        headers: apiClient.getHeaders(),
        body: JSON.stringify({ name, type })
      });
    },

    async update(oldName, newName, type = null) {
      const data = { name: newName };
      if (type) data.type = type;
      
      return apiClient.request(`${API_BASE_URL}/api/categories/${oldName}`, {
        method: 'PUT',
        headers: apiClient.getHeaders(),
        body: JSON.stringify(data)
      });
    },

    async delete(name) {
      return apiClient.request(`${API_BASE_URL}/api/categories/${name}`, {
        method: 'DELETE',
        headers: apiClient.getHeaders()
      });
    }
  },

  // Payment Sources endpoints
  paymentSources: {
    async getAll() {
      return apiClient.request(`${API_BASE_URL}/api/payment-sources`, {
        headers: apiClient.getHeaders()
      });
    },

    async create(name) {
      return apiClient.request(`${API_BASE_URL}/api/payment-sources`, {
        method: 'POST',
        headers: apiClient.getHeaders(),
        body: JSON.stringify({ name })
      });
    },

    async update(oldName, newName) {
      return apiClient.request(`${API_BASE_URL}/api/payment-sources/${oldName}`, {
        method: 'PUT',
        headers: apiClient.getHeaders(),
        body: JSON.stringify({ name: newName })
      });
    },

    async delete(name) {
      return apiClient.request(`${API_BASE_URL}/api/payment-sources/${name}`, {
        method: 'DELETE',
        headers: apiClient.getHeaders()
      });
    }
  },

  // Quick Add Items endpoints
  quickAddItems: {
    async getAll() {
      return apiClient.request(`${API_BASE_URL}/api/quick-add-items`, {
        headers: apiClient.getHeaders()
      });
    },

    async create(itemData) {
      return apiClient.request(`${API_BASE_URL}/api/quick-add-items`, {
        method: 'POST',
        headers: apiClient.getHeaders(),
        body: JSON.stringify(itemData)
      });
    },

    async update(id, itemData) {
      return apiClient.request(`${API_BASE_URL}/api/quick-add-items/${id}`, {
        method: 'PUT',
        headers: apiClient.getHeaders(),
        body: JSON.stringify(itemData)
      });
    },

    async delete(id) {
      return apiClient.request(`${API_BASE_URL}/api/quick-add-items/${id}`, {
        method: 'DELETE',
        headers: apiClient.getHeaders()
      });
    }
  },

  // Incomes endpoints
  incomes: {
    async getAll() {
      return apiClient.request(`${API_BASE_URL}/api/incomes`, {
        headers: apiClient.getHeaders()
      });
    },

    async getById(id) {
      return apiClient.request(`${API_BASE_URL}/api/incomes/${id}`, {
        headers: apiClient.getHeaders()
      });
    },

    async create(incomeData) {
      return apiClient.request(`${API_BASE_URL}/api/incomes`, {
        method: 'POST',
        headers: apiClient.getHeaders(),
        body: JSON.stringify(incomeData)
      });
    },

    async update(id, incomeData) {
      return apiClient.request(`${API_BASE_URL}/api/incomes/${id}`, {
        method: 'PUT',
        headers: apiClient.getHeaders(),
        body: JSON.stringify(incomeData)
      });
    },

    async delete(id) {
      return apiClient.request(`${API_BASE_URL}/api/incomes/${id}`, {
        method: 'DELETE',
        headers: apiClient.getHeaders()
      });
    }
  },

  // Backup & Restore
  backup: {
    async download() {
      const token = apiClient.getToken();
      const response = await fetch(`${API_BASE_URL}/api/backup`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.blob();
    },

    async restore(file) {
      const formData = new FormData();
      formData.append('backup', file);
      
      const token = apiClient.getToken();
      return apiClient.request(`${API_BASE_URL}/api/restore`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
    }
  }
};
