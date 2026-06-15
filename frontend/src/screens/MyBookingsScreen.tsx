import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Card, Chip, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, typography, spacing, borderRadius, shadows } from '../theme';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/api';
import { Booking } from '../types';
import { RootStackParamList } from '../types/navigation';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

const MyBookingsScreen: React.FC<Props> = ({ navigation }) => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) loadBookings();
  }, [user?.id]);

  const loadBookings = async () => {
    try {
      const data = await apiService.getUserBookings(user!.id);
      setBookings(data);
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return colors.secondary;
      case 'PENDING': return colors.accent;
      case 'COMPLETED': return colors.primary;
      case 'CANCELLED': return colors.error;
      default: return colors.textSecondary;
    }
  };

  const renderBooking = ({ item }: { item: Booking }) => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <Text style={styles.providerName}>{item.provider?.businessName || 'Provider'}</Text>
          <Chip style={{ backgroundColor: getStatusColor(item.status) + '20' }} textStyle={{ color: getStatusColor(item.status), fontSize: 12 }}>
            {item.status}
          </Chip>
        </View>
        <Text style={styles.serviceName}>{item.service?.name || 'Service'}</Text>
        <Text style={styles.dateTime}>📅 {item.scheduledDate} at {item.scheduledTime}</Text>
        <Text style={styles.address}>📍 {item.address}</Text>
        <View style={styles.cardFooter}>
          <Text style={styles.amount}>₹{item.totalAmount}</Text>
          <Button mode="outlined" compact onPress={() => { }}>Details</Button>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Bookings</Text>
      </View>
      <FlatList data={bookings} renderItem={renderBooking} keyExtractor={(item) => item.id.toString()} contentContainerStyle={styles.list} showsVerticalScrollIndicator={false} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { padding: spacing.lg, paddingTop: spacing.xxl, backgroundColor: colors.primary },
  title: { ...typography.h1, color: colors.white },
  list: { padding: spacing.md },
  card: { marginBottom: spacing.md, borderRadius: borderRadius.lg, backgroundColor: colors.surface, ...shadows.sm },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  providerName: { ...typography.body, fontWeight: '600' },
  serviceName: { ...typography.caption, color: colors.textSecondary },
  dateTime: { ...typography.caption, marginTop: spacing.xs },
  address: { ...typography.caption, color: colors.textSecondary, marginTop: spacing.xs },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.md },
  amount: { ...typography.h3, color: colors.primary },
});

export default MyBookingsScreen;
