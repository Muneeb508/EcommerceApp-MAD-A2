import axios, { AxiosError, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ============================================
// CONFIGURATION SETTINGS
// ============================================
// CHANGE THIS TO YOUR COMPUTER'S IP ADDRESS
// For Android Emulator: use 10.0.2.2
// For iOS Simulator: use localhost
// For Physical Device: use your computer's IP (e.g., 192.168.1.x)
const API_BASE_URL = 'http://localhost:3000/api';

// Enable/Disable debugging logs
const DEBUG_MODE = true;

// ============================================
// API ENDPOINTS
// ============================================
export const API_ENDPOINTS = {
  // Authentication endpoints
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    LOGOUT: '/auth/logout',
    PROFILE: '/auth/profile',
  },
  // Product endpoints
  PRODUCTS: {
    LIST: '/products',
    DETAIL: (id: string) => `/products/${id}`,
    SEARCH: '/products/search',
    CATEGORIES: '/products/categories',
  },
  // Cart endpoints
  CART: {
    GET: '/cart',
    ADD: '/cart/add',
    UPDATE: '/cart/update',
    REMOVE: '/cart/remove',
    CLEAR: '/cart/clear',
  },
  // Order endpoints
  ORDERS: {
    CREATE: '/orders',
    LIST: '/orders',
    DETAIL: (id: string) => `/orders/${id}`,
    CANCEL: (id: string) => `/orders/${id}/cancel`,
  },
  // Profile endpoints
  PROFILE: {
    GET: '/profile',
    UPDATE: '/profile',
    CHANGE_PASSWORD: '/profile/password',
  },
} as const;

// ============================================
// AXIOS INSTANCE CREATION
// ============================================
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============================================
// REQUEST INTERCEPTOR
// ============================================
// Automatically adds authentication token to all requests
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('token');
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        
        if (DEBUG_MODE) {
          console.log('🔐 [API] Token attached to request:', config.url);
        }
      } else {
        if (DEBUG_MODE) {
          console.log('⚠️ [API] No token found for request:', config.url);
        }
      }
      
      if (DEBUG_MODE) {
        console.log('📤 [API] Request:', {
          method: config.method?.toUpperCase(),
          url: config.url,
          headers: config.headers,
        });
      }
      
      return config;
    } catch (error) {
      console.error('❌ [API] Request interceptor error:', error);
      return Promise.reject(error);
    }
  },
  (error: AxiosError) => {
    console.error('❌ [API] Request setup error:', error.message);
    return Promise.reject(error);
  }
);

// ============================================
// RESPONSE INTERCEPTOR
// ============================================
// Handles responses and errors globally
api.interceptors.response.use(
  (response: AxiosResponse) => {
    if (DEBUG_MODE) {
      console.log('✅ [API] Response:', {
        status: response.status,
        url: response.config.url,
        data: response.data,
      });
    }
    return response;
  },
  async (error: AxiosError) => {
    if (DEBUG_MODE) {
      console.error('❌ [API] Response error:', {
        status: error.response?.status,
        url: error.config?.url,
        message: error.message,
        data: error.response?.data,
      });
    }
    
    // Handle specific error cases
    if (error.response) {
      const status = error.response.status;
      
      switch (status) {
        case 401:
          // Unauthorized - token expired or invalid
          console.warn('⚠️ [API] Authentication failed - clearing token');
          await AsyncStorage.removeItem('token');
          // You might want to redirect to login screen here
          break;
          
        case 403:
          console.warn('⚠️ [API] Access forbidden');
          break;
          
        case 404:
          console.warn('⚠️ [API] Resource not found');
          break;
          
        case 500:
          console.error('⚠️ [API] Server error');
          break;
          
        default:
          console.warn(`⚠️ [API] Error status: ${status}`);
      }
    } else if (error.request) {
      // Network error
      console.error('❌ [API] Network error - no response received');
    } else {
      // Request setup error
      console.error('❌ [API] Request setup error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// ============================================
// HELPER FUNCTIONS
// ============================================
/**
 * Sets the authentication token
 */
export const setAuthToken = async (token: string): Promise<void> => {
  await AsyncStorage.setItem('token', token);
  if (DEBUG_MODE) {
    console.log('🔐 [API] Token stored successfully');
  }
};

/**
 * Removes the authentication token
 */
export const removeAuthToken = async (): Promise<void> => {
  await AsyncStorage.removeItem('token');
  if (DEBUG_MODE) {
    console.log('🔐 [API] Token removed successfully');
  }
};

/**
 * Gets the current authentication token
 */
export const getAuthToken = async (): Promise<string | null> => {
  const token = await AsyncStorage.getItem('token');
  if (DEBUG_MODE) {
    console.log('🔐 [API] Token retrieved:', token ? 'Token exists' : 'No token');
  }
  return token;
};

/**
 * Updates the API base URL (useful for switching environments)
 */
export const updateApiBaseUrl = (newUrl: string): void => {
  api.defaults.baseURL = newUrl;
  if (DEBUG_MODE) {
    console.log('🔧 [API] Base URL updated to:', newUrl);
  }
};

/**
 * Gets the current API base URL
 */
export const getApiBaseUrl = (): string => {
  return api.defaults.baseURL || API_BASE_URL;
};

// ============================================
// EXPORTS
// ============================================
export default api;
export { API_BASE_URL };

