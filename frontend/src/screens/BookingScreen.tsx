import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Text, TextInput, ActivityIndicator } from 'react-native-paper';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, borderRadius, shadows } from '../theme';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/api';
import { Service, Provider } from '../types';
import { RootStackParamList } from '../types/navigation';

type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'Booking'>;
    route: RouteProp<RootStackParamList, 'Booking'>;
};

const TIME_SLOTS = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

const getNext7Days = () => {
    const days = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    for (let i = 0; i < 7; i++) {
        const d = new Date();
        d.setDate(d.getDate() + i);
        days.push({
            label: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : dayNames[d.getDay()],
            date: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`,
            day: d.getDate(),
            month: monthNames[d.getMonth()],
        });
    }
    return days;
};

const BookingScreen: React.FC<Props> = ({ navigation, route }) => {
    const { providerId, serviceId } = route.params;
    const { user } = useAuth();
    const [provider, setProvider] = useState<Provider | null>(null);
    const [services, setServices] = useState<Service[]>([]);
    const [selectedServiceId, setSelectedServiceId] = useState<number | undefined>(serviceId);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [address, setAddress] = useState('');
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);

    const days = getNext7Days();

    useEffect(() => {
        (async () => {
            try {
                const [providerData, servicesData] = await Promise.all([
                    apiService.getProviderById(providerId),
                    apiService.getProviderServices(providerId),
                ]);
                setProvider(providerData);
                setServices(servicesData);
                if (!selectedServiceId && servicesData.length > 0) {
                    setSelectedServiceId(servicesData[0].id);
                }
            } catch (e) {
                console.error('Error loading booking data:', e);
            } finally {
                setLoadingData(false);
            }
        })();
    }, [providerId]);

    const selectedService = services.find((s) => s.id === selectedServiceId);

    const handleBook = async () => {
        if (!selectedServiceId) { Alert.alert('Select a service', 'Please choose a service to book.'); return; }
        if (!selectedDate) { Alert.alert('Select a date', 'Please choose a date for your booking.'); return; }
        if (!selectedTime) { Alert.alert('Select a time', 'Please choose a time slot.'); return; }
        if (!address.trim()) { Alert.alert('Enter address', 'Please enter your service address.'); return; }

        setLoading(true);
        try {
            await apiService.createBooking({
                userId: user?.id,
                providerId,
                serviceId: selectedServiceId,
                scheduledDate: selectedDate,
                scheduledTime: selectedTime,
                address,
                notes,
            });
            Alert.alert('Booking Confirmed!', `Your booking with ${provider?.businessName} is confirmed for ${selectedDate} at ${selectedTime}.`, [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } catch (err: any) {
            Alert.alert('Booking Failed', err.message || 'Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (loadingData) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <LinearGradient colors={[colors.primary, '#1D4ED8']} style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                    <Text style={styles.backBtnText}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Book Service</Text>
                {provider && <Text style={styles.headerSubtitle}>{provider.businessName}</Text>}
            </LinearGradient>

            <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
                {/* Service selection */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Select Service</Text>
                    {services.map((s) => (
                        <TouchableOpacity key={s.id} style={[styles.serviceOption, selectedServiceId === s.id && styles.serviceOptionActive]}
                            onPress={() => setSelectedServiceId(s.id)}>
                            <View style={styles.serviceOptionLeft}>
                                <View style={[styles.radioCircle, selectedServiceId === s.id && styles.radioCircleActive]}>
                                    {selectedServiceId === s.id && <View style={styles.radioDot} />}
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={[styles.serviceOptionName, selectedServiceId === s.id && { color: colors.primary }]}>{s.name}</Text>
                                    {s.description ? <Text style={styles.serviceOptionDesc} numberOfLines={1}>{s.description}</Text> : null}
                                </View>
                            </View>
                            <View style={styles.serviceOptionRight}>
                                <Text style={styles.serviceOptionPrice}>₹{s.price}</Text>
                                {s.durationMinutes ? <Text style={styles.serviceOptionDuration}>{s.durationMinutes} min</Text> : null}
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Date selection */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Select Date</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
                        {days.map((d) => (
                            <TouchableOpacity key={d.date} style={[styles.dateChip, selectedDate === d.date && styles.dateChipActive]}
                                onPress={() => setSelectedDate(d.date)}>
                                <Text style={[styles.dateChipLabel, selectedDate === d.date && { color: '#fff' }]}>{d.label}</Text>
                                <Text style={[styles.dateChipDay, selectedDate === d.date && { color: '#fff' }]}>{d.day}</Text>
                                <Text style={[styles.dateChipMonth, selectedDate === d.date && { color: 'rgba(255,255,255,0.8)' }]}>{d.month}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Time selection */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Select Time</Text>
                    <View style={styles.timeGrid}>
                        {TIME_SLOTS.map((t) => (
                            <TouchableOpacity key={t} style={[styles.timeChip, selectedTime === t && styles.timeChipActive]}
                                onPress={() => setSelectedTime(t)}>
                                <Text style={[styles.timeChipText, selectedTime === t && { color: '#fff', fontWeight: '700' }]}>{t}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Address */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Service Address</Text>
                    <TextInput
                        label="Your address *"
                        value={address}
                        onChangeText={setAddress}
                        mode="outlined"
                        multiline
                        numberOfLines={3}
                        style={styles.input}
                        outlineColor={colors.border}
                        activeOutlineColor={colors.primary}
                    />
                    <TextInput
                        label="Additional notes (optional)"
                        value={notes}
                        onChangeText={setNotes}
                        mode="outlined"
                        multiline
                        style={styles.input}
                        outlineColor={colors.border}
                        activeOutlineColor={colors.primary}
                    />
                </View>

                {/* Summary */}
                {selectedService && selectedDate && selectedTime ? (
                    <View style={styles.summaryCard}>
                        <Text style={styles.summaryTitle}>Booking Summary</Text>
                        <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Service</Text><Text style={styles.summaryValue}>{selectedService.name}</Text></View>
                        <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Date</Text><Text style={styles.summaryValue}>{selectedDate}</Text></View>
                        <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Time</Text><Text style={styles.summaryValue}>{selectedTime}</Text></View>
                        <View style={[styles.summaryRow, { borderTopWidth: 1, borderTopColor: colors.border, marginTop: 8, paddingTop: 8 }]}>
                            <Text style={[styles.summaryLabel, { fontWeight: '700' }]}>Total</Text>
                            <Text style={[styles.summaryValue, { color: colors.primary, fontWeight: '700', fontSize: 18 }]}>₹{selectedService.price}</Text>
                        </View>
                    </View>
                ) : null}

                <View style={{ height: 100 }} />
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.confirmBtn} onPress={handleBook} disabled={loading}>
                    {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.confirmBtnText}>Confirm Booking</Text>}
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { paddingTop: 56, paddingBottom: 24, paddingHorizontal: 20 },
    backBtn: { marginBottom: 12, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20, width: 36, height: 36, justifyContent: 'center', alignItems: 'center' },
    backBtnText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
    headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
    headerSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
    scroll: { flex: 1 },
    section: { backgroundColor: colors.surface, marginTop: 12, padding: 16, marginHorizontal: 0 },
    sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.textPrimary, marginBottom: 14 },
    serviceOption: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14, borderRadius: 14, borderWidth: 1.5, borderColor: colors.border, marginBottom: 10, backgroundColor: colors.background },
    serviceOptionActive: { borderColor: colors.primary, backgroundColor: '#EFF6FF' },
    serviceOptionLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: 12 },
    radioCircle: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: colors.border, justifyContent: 'center', alignItems: 'center' },
    radioCircleActive: { borderColor: colors.primary },
    radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary },
    serviceOptionName: { fontSize: 15, fontWeight: '600', color: colors.textPrimary },
    serviceOptionDesc: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
    serviceOptionRight: { alignItems: 'flex-end' },
    serviceOptionPrice: { fontSize: 16, fontWeight: 'bold', color: colors.primary },
    serviceOptionDuration: { fontSize: 11, color: colors.textSecondary, marginTop: 2 },
    dateChip: { alignItems: 'center', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 14, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.background, minWidth: 70 },
    dateChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
    dateChipLabel: { fontSize: 11, color: colors.textSecondary, fontWeight: '600' },
    dateChipDay: { fontSize: 22, fontWeight: 'bold', color: colors.textPrimary, marginVertical: 2 },
    dateChipMonth: { fontSize: 11, color: colors.textSecondary },
    timeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    timeChip: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 12, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.background },
    timeChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
    timeChipText: { fontSize: 14, color: colors.textPrimary, fontWeight: '500' },
    input: { marginBottom: 12, backgroundColor: colors.surface },
    summaryCard: { margin: 16, backgroundColor: colors.surface, borderRadius: 18, padding: 18, ...shadows.sm },
    summaryTitle: { fontSize: 16, fontWeight: '700', color: colors.textPrimary, marginBottom: 14 },
    summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    summaryLabel: { fontSize: 14, color: colors.textSecondary },
    summaryValue: { fontSize: 14, color: colors.textPrimary, fontWeight: '600' },
    footer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: colors.surface, padding: 16, borderTopWidth: 1, borderTopColor: colors.border },
    confirmBtn: { backgroundColor: colors.primary, borderRadius: 16, paddingVertical: 16, alignItems: 'center' },
    confirmBtnText: { color: '#fff', fontSize: 17, fontWeight: 'bold' },
});

export default BookingScreen;
