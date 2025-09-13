const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('authToken');
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

    if (this.token) {
      config.headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, config);
      
      // Handle case where server is not running or returns 404
      if (!response.ok) {
        if (response.status === 404 || response.status === 0) {
          throw new Error('Backend server not available');
        }
        // Try to parse JSON response
        try {
          const data = await response.json();
          throw new Error(data.error || data.message || 'API request failed');
        } catch {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.warn(`API Error (${endpoint}):`, error.message);
      throw error;
    }
  }

  // Auth methods
  async register(userData) {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    if (response.token) {
      this.setToken(response.token);
    }
    
    return response;
  }

  async login(credentials) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (response.token) {
      this.setToken(response.token);
    }
    
    return response;
  }

  async getProfile() {
    return this.request('/auth/profile');
  }

  // Portfolio methods
  async getPortfolios() {
    return this.request('/portfolios');
  }

  async getPortfolio(level) {
    return this.request(`/portfolios/${level}`);
  }

  async executeTrade(level, tradeData) {
    return this.request(`/portfolios/${level}/trade`, {
      method: 'POST',
      body: JSON.stringify(tradeData),
    });
  }

  // Stock methods
  async getStockQuote(symbol) {
    return this.request(`/stocks/quote/${symbol}`);
  }

  async searchStocks(query) {
    return this.request(`/stocks/search?q=${encodeURIComponent(query)}`);
  }

  async getTrendingStocks() {
    return this.request('/stocks/trending');
  }

  async getAvailableStocks(level) {
    return this.request(`/stocks/available/${level}`);
  }

  // User methods
  async getUserStats() {
    return this.request('/users/stats');
  }

  async updatePreferences(preferences) {
    return this.request('/users/preferences', {
      method: 'PUT',
      body: JSON.stringify(preferences),
    });
  }

  // Token management
  setToken(token) {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  isAuthenticated() {
    return !!this.token;
  }
}

export default new ApiService();