export const colors = {
  primary: '#2563EB',
  primaryDark: '#1D4ED8',
  primaryLight: '#3B82F6',
  secondary: '#10B981',
  accent: '#F59E0B',
  error: '#EF4444',
  background: '#F8FAFC',
  surface: '#FFFFFF',
  textPrimary: '#1E293B',
  textSecondary: '#64748B',
  border: '#E2E8F0',
  white: '#FFFFFF',
  black: '#000000',
  text: '#1E293B',
};

export const premiumColors = {
  darkBackground: '#0F172A',
  darkSurface: '#1E293B',
  indigo: '#6366F1',
  indigoDark: '#4F46E5',
  glassBackground: 'rgba(255, 255, 255, 0.1)',
  glassBorder: 'rgba(255, 255, 255, 0.2)',
  cardBackground: '#FFFFFFCC',
  vibrantBlue: '#2563EB',
  vibrantIndigo: '#4F46E5',
};

export const glassStyles = {
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(10px)', // Web only property, will ignore on mobile
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    overflow: 'hidden' as const,
  },
  darkContainer: {
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden' as const,
  }
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const typography = {
  h1: {
    fontSize: 28,
    fontWeight: 'bold' as const,
  },
  h2: {
    fontSize: 24,
    fontWeight: '600' as const,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600' as const,
  },
  body: {
    fontSize: 16,
    fontWeight: 'normal' as const,
  },
  caption: {
    fontSize: 14,
    fontWeight: 'normal' as const,
  },
  small: {
    fontSize: 12,
    fontWeight: 'normal' as const,
  },
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
};

export const serviceCategories = [
  { id: 'PLUMBING', name: 'Plumbing', icon: '🔧', color: '#3B82F6' },
  { id: 'ELECTRICAL', name: 'Electrical', icon: '⚡', color: '#F59E0B' },
  { id: 'CARPENTRY', name: 'Carpentry', icon: '🪵', color: '#8B4513' },
  { id: 'TUTORING', name: 'Tutoring', icon: '📚', color: '#10B981' },
  { id: 'HEALTHCARE', name: 'Healthcare', icon: '🏥', color: '#EF4444' },
  { id: 'DELIVERY', name: 'Delivery', icon: '🚚', color: '#6366F1' },
  { id: 'CLEANING', name: 'Cleaning', icon: '🧹', color: '#14B8A6' },
  { id: 'SHOPPING', name: 'Shopping', icon: '🛒', color: '#EC4899' },
  { id: 'SECURITY', name: 'Security', icon: '🔒', color: '#374151' },
  { id: 'AUTOMOTIVE', name: 'Automotive', icon: '🚗', color: '#F97316' },
  { id: 'PAINTING', name: 'Painting', icon: '🎨', color: '#A855F7' },
  { id: 'OTHER', name: 'Other', icon: '📦', color: '#64748B' },
];
