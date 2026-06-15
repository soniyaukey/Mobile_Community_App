import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

const getBaseUrl = () => {
  const extra = Constants.expoConfig?.extra;
  if (extra?.apiUrl) {
    return extra.apiUrl;
  }

  // Fallback for development
  // Replace with your computer's LAN IP (e.g., 192.168.1.x) if testing on a physical device
  const LOCAL_IP = 'localhost';

  // Explicitly use localhost for Web to avoid any IP confusion
  if (Platform.OS === 'web') {
    return 'http://localhost:8090/api';
  }

  // If we are on Android Emulator, use 10.0.2.2, otherwise use LOCAL_IP
  // On physical Android, 10.0.2.2 doesn't work.
  const isAndroidEmulator = Platform.OS === 'android' &&
    (Constants.deviceName?.includes('Emulator') || Constants.deviceName?.includes('sdk_gphone'));

  return isAndroidEmulator
    ? 'http://10.0.2.2:8090/api'
    : `http://${LOCAL_IP}:8090/api`;
};

const BASE_URL = getBaseUrl();

class ApiService {
  private async getHeaders() {
    const token = await AsyncStorage.getItem('authToken');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  private async request(method: string, endpoint: string, data?: any) {
    const headers = await this.getHeaders();
    const url = `${BASE_URL}${endpoint}`;

    const options: RequestInit = {
      method,
      headers,
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, options);
      const responseData = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          await AsyncStorage.removeItem('authToken');
        }
        throw new Error(responseData.message || 'Request failed');
      }

      return responseData;
    } catch (error) {
      console.error(`API Error [${method} ${url}]:`, error);
      throw error;
    }
  }

  // Auth
  async register(data: { email: string; password: string; name: string; phone?: string; role?: string }) {
    return this.request('POST', '/auth/register', data);
  }

  async login(email: string, password: string) {
    return this.request('POST', '/auth/login', { email, password });
  }

  async getProfile() {
    return this.request('GET', '/auth/profile');
  }

  async updateProfile(data: any) {
    return this.request('PUT', '/auth/profile', data);
  }

  // Providers
  async getProviders() {
    return this.request('GET', '/providers');
  }

  async getVerifiedProviders() {
    return this.request('GET', '/providers/verified');
  }

  async getProvidersByCategory(category: string) {
    return this.request('GET', `/providers/category/${category}`);
  }

  async getNearbyProviders(lat: number, lng: number, radius?: number) {
    return this.request('GET', `/providers/nearby?lat=${lat}&lng=${lng}${radius ? `&radius=${radius}` : ''}`);
  }

  async getTopRatedProviders() {
    return this.request('GET', '/providers/top-rated');
  }

  async getProviderById(id: number) {
    return this.request('GET', `/providers/${id}`);
  }

  async getProviderServices(providerId: number) {
    return this.request('GET', `/providers/${providerId}/services`);
  }

  async createService(providerId: number, data: any) {
    return this.request('POST', `/providers/${providerId}/services`, data);
  }

  async updateService(serviceId: number, data: any) {
    return this.request('PUT', `/providers/services/${serviceId}`, data);
  }

  async deleteService(serviceId: number) {
    return this.request('DELETE', `/providers/services/${serviceId}`);
  }

  // Bookings
  async getUserBookings(userId: number) {
    return this.request('GET', `/bookings/user/${userId}`);
  }

  async getProviderBookings(providerId: number) {
    return this.request('GET', `/bookings/provider/${providerId}`);
  }

  async createBooking(data: any) {
    return this.request('POST', '/bookings', data);
  }

  async updateBookingStatus(bookingId: number, status: string) {
    return this.request('PUT', `/bookings/${bookingId}/status`, { status });
  }

  async processPayment(bookingId: number) {
    return this.request('POST', `/bookings/${bookingId}/payment`);
  }

  async getProviderEarnings(providerId: number) {
    return this.request('GET', `/bookings/provider/${providerId}/earnings`);
  }

  // Reviews
  async getProviderReviews(providerId: number) {
    return this.request('GET', `/reviews/provider/${providerId}`);
  }

  async createReview(data: any) {
    return this.request('POST', '/reviews', data);
  }

  // Messages
  async getConversation(user1: number, user2: number) {
    return this.request('GET', `/messages/conversation?user1=${user1}&user2=${user2}`);
  }

  async getBookingMessages(bookingId: number) {
    return this.request('GET', `/messages/booking/${bookingId}`);
  }

  async sendMessage(data: any) {
    return this.request('POST', '/messages', data);
  }

  async getUnreadCount(userId: number) {
    return this.request('GET', `/messages/unread/${userId}`);
  }

  // Admin
  async getAdminDashboard() {
    return this.request('GET', '/admin/dashboard');
  }

  async getAllUsers() {
    return this.request('GET', '/admin/users');
  }

  async getPendingProviders() {
    return this.request('GET', '/admin/providers/pending');
  }

  async verifyProvider(providerId: number, verified: boolean) {
    return this.request('PUT', `/admin/providers/${providerId}/verify`, { verified });
  }

  async createAdminProvider(data: any) {
    return this.request('POST', '/admin/providers', data);
  }

  async updateAdminProvider(providerId: number, data: any) {
    return this.request('PUT', `/admin/providers/${providerId}`, data);
  }

  async deleteAdminProvider(providerId: number) {
    return this.request('DELETE', `/admin/providers/${providerId}`);
  }
}

export const apiService = new ApiService();
export default apiService;
