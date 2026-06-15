export interface User {
  id: number;
  email: string;
  name: string;
  phone?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  role: 'USER' | 'PROVIDER' | 'ADMIN';
  profileImage?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Provider {
  id: number;
  userId: number;
  businessName: string;
  description?: string;
  serviceCategory: string;
  hourlyRate?: number;
  rating: number;
  totalReviews: number;
  isVerified: boolean;
  address?: string;
  latitude?: number;
  longitude?: number;
  workingHours?: string;
  serviceAreas?: string;
  profileImage?: string;
  coverImage?: string;
  phone?: string;
  availability?: string;
  experience?: string;
  distance?: number;
}

export interface Service {
  id: number;
  providerId: number;
  providerName?: string;
  name: string;
  description?: string;
  price: number;
  durationMinutes?: number;
  category: string;
  isActive: boolean;
}

export interface Booking {
  id: number;
  userId: number;
  providerId: number;
  serviceId: number;
  status: 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'REJECTED';
  scheduledDate: string;
  scheduledTime: string;
  totalAmount: number;
  paymentStatus: 'PENDING' | 'PAID' | 'REFUNDED';
  notes?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  createdAt: string;
  user?: User;
  provider?: Provider;
  service?: Service;
}

export interface Review {
  id: number;
  bookingId: number;
  userId: number;
  providerId: number;
  rating: number;
  comment?: string;
  createdAt: string;
  user?: User;
}

export interface Message {
  id: number;
  senderId: number;
  receiverId: number;
  bookingId?: number;
  content: string;
  isRead: boolean;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface DashboardStats {
  totalUsers: number;
  totalProviders: number;
  totalBookings: number;
  totalRevenue: number;
  pendingProviders: number;
}
