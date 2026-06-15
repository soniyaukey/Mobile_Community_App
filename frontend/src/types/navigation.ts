export type RootStackParamList = {
    Splash: undefined;
    Login: undefined;
    Register: { role?: string };
    Main: undefined;
    Search: { category?: string; query?: string };
    ProviderDetail: { providerId: number };
    Booking: { providerId: number; serviceId?: number };
    Chat: { bookingId?: number; otherUserId: number };
    EditProfile: undefined;
  NearbyServices: undefined;
};

export type TabParamList = {
    Home: undefined;
    Nearby: undefined;
    Search: { category?: string; query?: string };
    Bookings: undefined;
    Profile: undefined;
};
