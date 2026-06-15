import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, Linking } from 'react-native';
import { Text, Chip, Divider, ActivityIndicator } from 'react-native-paper';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, typography, spacing, borderRadius, shadows } from '../theme';
import apiService from '../services/api';
import { Provider, Service, Review } from '../types';
import { RootStackParamList } from '../types/navigation';

type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'ProviderDetail'>;
    route: RouteProp<RootStackParamList, 'ProviderDetail'>;
};

const STARS = (rating: number) => '⭐'.repeat(Math.round(rating)) + '☆'.repeat(5 - Math.round(rating));

const ProviderDetailScreen: React.FC<Props> = ({ navigation, route }) => {
    const { providerId } = route.params;
    const [provider, setProvider] = useState<Provider | null>(null);
    const [services, setServices] = useState<Service[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'about' | 'services' | 'reviews'>('about');

    useEffect(() => {
        (async () => {
            try {
                const [providerData, servicesData, reviewsData] = await Promise.all([
                    apiService.getProviderById(providerId),
                    apiService.getProviderServices(providerId),
                    apiService.getProviderReviews(providerId),
                ]);
                setProvider(providerData);
                setServices(servicesData);
                setReviews(reviewsData);
            } catch (error) {
                console.error('Error loading provider details:', error);
            } finally {
                setLoading(false);
            }
        })();
    }, [providerId]);

    if (loading || !provider) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={{ marginTop: 12, color: colors.textSecondary }}>Loading provider...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Hero Header */}
                <LinearGradient colors={[colors.primary, '#1D4ED8']} style={styles.hero}>
                    <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                        <Text style={styles.backBtnText}>←</Text>
                    </TouchableOpacity>
                    {provider.profileImage ? (
                        <Image source={{ uri: provider.profileImage }} style={styles.avatar} />
                    ) : (
                        <View style={[styles.avatar, styles.avatarFallback]}>
                            <Text style={styles.avatarInitial}>{provider.businessName?.charAt(0).toUpperCase()}</Text>
                        </View>
                    )}
                    <Text style={styles.heroName}>{provider.businessName}</Text>
                    <View style={styles.heroChips}>
                        <View style={styles.categoryChip}>
                            <Text style={styles.categoryChipText}>{provider.serviceCategory}</Text>
                        </View>
                        {provider.isVerified && (
                            <View style={styles.verifiedChip}>
                                <Text style={styles.verifiedChipText}>✅ Verified</Text>
                            </View>
                        )}
                    </View>
                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>⭐ {provider.rating?.toFixed(1) || '0.0'}</Text>
                            <Text style={styles.statLabel}>Rating</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{provider.totalReviews || 0}</Text>
                            <Text style={styles.statLabel}>Reviews</Text>
                        </View>
                        {provider.hourlyRate ? (
                            <>
                                <View style={styles.statDivider} />
                                <View style={styles.statItem}>
                                    <Text style={styles.statValue}>₹{provider.hourlyRate}</Text>
                                    <Text style={styles.statLabel}>/hour</Text>
                                </View>
                            </>
                        ) : null}
                        {provider.experience ? (
                            <>
                                <View style={styles.statDivider} />
                                <View style={styles.statItem}>
                                    <Text style={styles.statValue}>{provider.experience}</Text>
                                    <Text style={styles.statLabel}>Exp.</Text>
                                </View>
                            </>
                        ) : null}
                    </View>
                </LinearGradient>

                {/* Contact bar */}
                <View style={styles.contactBar}>
                    {provider.phone ? (
                        <TouchableOpacity style={styles.contactBtn} onPress={() => Linking.openURL(`tel:${provider.phone}`)}>
                            <Text style={styles.contactBtnIcon}>📞</Text>
                            <Text style={styles.contactBtnText}>Call</Text>
                        </TouchableOpacity>
                    ) : null}
                    {provider.address ? (
                        <View style={styles.contactBtn}>
                            <Text style={styles.contactBtnIcon}>📍</Text>
                            <Text style={styles.contactBtnText} numberOfLines={1}>{provider.address}</Text>
                        </View>
                    ) : null}
                    {provider.workingHours ? (
                        <View style={styles.contactBtn}>
                            <Text style={styles.contactBtnIcon}>🕐</Text>
                            <Text style={styles.contactBtnText}>{provider.workingHours}</Text>
                        </View>
                    ) : null}
                </View>

                {/* Tabs */}
                <View style={styles.tabBar}>
                    {(['about', 'services', 'reviews'] as const).map((tab) => (
                        <TouchableOpacity key={tab} style={[styles.tab, activeTab === tab && styles.tabActive]} onPress={() => setActiveTab(tab)}>
                            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                                {tab === 'about' ? 'About' : tab === 'services' ? `Services (${services.length})` : `Reviews (${reviews.length})`}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Tab content */}
                <View style={styles.tabContent}>
                    {activeTab === 'about' && (
                        <View>
                            <Text style={styles.sectionTitle}>About</Text>
                            <Text style={styles.description}>{provider.description || 'No description available.'}</Text>
                            {provider.availability ? (
                                <View style={styles.infoRow}>
                                    <Text style={styles.infoLabel}>Availability</Text>
                                    <View style={[styles.availBadge, { backgroundColor: provider.availability === 'Busy' ? '#FEE2E2' : '#D1FAE5' }]}>
                                        <Text style={[styles.availText, { color: provider.availability === 'Busy' ? colors.error : colors.secondary }]}>
                                            {provider.availability}
                                        </Text>
                                    </View>
                                </View>
                            ) : null}
                        </View>
                    )}

                    {activeTab === 'services' && (
                        <View>
                            <Text style={styles.sectionTitle}>Services Offered</Text>
                            {services.length > 0 ? services.map((service) => (
                                <View key={service.id} style={styles.serviceCard}>
                                    <View style={styles.serviceInfo}>
                                        <Text style={styles.serviceName}>{service.name}</Text>
                                        {service.description ? <Text style={styles.serviceDesc}>{service.description}</Text> : null}
                                        <View style={styles.serviceMeta}>
                                            <Text style={styles.servicePrice}>₹{service.price}</Text>
                                            {service.durationMinutes ? (
                                                <Text style={styles.serviceDuration}>⏱ {service.durationMinutes} min</Text>
                                            ) : null}
                                        </View>
                                    </View>
                                    <TouchableOpacity style={styles.bookServiceBtn} onPress={() => navigation.navigate('Booking', { providerId, serviceId: service.id })}>
                                        <Text style={styles.bookServiceBtnText}>Book</Text>
                                    </TouchableOpacity>
                                </View>
                            )) : (
                                <Text style={styles.emptyText}>No services listed yet.</Text>
                            )}
                        </View>
                    )}

                    {activeTab === 'reviews' && (
                        <View>
                            <Text style={styles.sectionTitle}>Customer Reviews</Text>
                            {reviews.length > 0 ? reviews.slice(0, 10).map((review) => (
                                <View key={review.id} style={styles.reviewCard}>
                                    <View style={styles.reviewHeader}>
                                        <View style={styles.reviewAvatar}>
                                            <Text style={styles.reviewAvatarText}>{review.user?.name?.charAt(0) || 'U'}</Text>
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.reviewerName}>{review.user?.name || 'Anonymous'}</Text>
                                            <Text style={styles.reviewStars}>{STARS(review.rating)}</Text>
                                        </View>
                                    </View>
                                    {review.comment ? <Text style={styles.reviewComment}>{review.comment}</Text> : null}
                                </View>
                            )) : (
                                <Text style={styles.emptyText}>No reviews yet.</Text>
                            )}
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* Sticky Book Now button */}
            <View style={styles.stickyFooter}>
                <TouchableOpacity style={styles.bookNowBtn} onPress={() => navigation.navigate('Booking', { providerId })}>
                    <Text style={styles.bookNowText}>Book Now</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    hero: { paddingTop: 56, paddingBottom: 28, alignItems: 'center', paddingHorizontal: 20 },
    backBtn: { position: 'absolute', top: 52, left: 16, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20, width: 36, height: 36, justifyContent: 'center', alignItems: 'center' },
    backBtnText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
    avatar: { width: 90, height: 90, borderRadius: 22, borderWidth: 3, borderColor: 'rgba(255,255,255,0.5)', marginBottom: 12 },
    avatarFallback: { backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
    avatarInitial: { fontSize: 40, color: '#fff', fontWeight: 'bold' },
    heroName: { fontSize: 22, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 10 },
    heroChips: { flexDirection: 'row', gap: 8, marginBottom: 16 },
    categoryChip: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 12 },
    categoryChipText: { color: '#fff', fontSize: 13, fontWeight: '600' },
    verifiedChip: { backgroundColor: colors.secondary + '30', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 12 },
    verifiedChipText: { color: '#fff', fontSize: 13, fontWeight: '600' },
    statsRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 16, paddingVertical: 12, paddingHorizontal: 20, gap: 0 },
    statItem: { alignItems: 'center', paddingHorizontal: 14 },
    statValue: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
    statLabel: { fontSize: 11, color: 'rgba(255,255,255,0.75)', marginTop: 2 },
    statDivider: { width: 1, height: 32, backgroundColor: 'rgba(255,255,255,0.3)' },
    contactBar: { flexDirection: 'row', flexWrap: 'wrap', padding: 12, gap: 8, backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border },
    contactBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F1F5F9', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, gap: 6 },
    contactBtnIcon: { fontSize: 16 },
    contactBtnText: { fontSize: 13, color: colors.textPrimary, fontWeight: '500', maxWidth: 140 },
    tabBar: { flexDirection: 'row', backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border },
    tab: { flex: 1, paddingVertical: 14, alignItems: 'center' },
    tabActive: { borderBottomWidth: 2, borderBottomColor: colors.primary },
    tabText: { fontSize: 13, color: colors.textSecondary, fontWeight: '500' },
    tabTextActive: { color: colors.primary, fontWeight: '700' },
    tabContent: { padding: 16, paddingBottom: 100 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: colors.textPrimary, marginBottom: 12 },
    description: { fontSize: 15, color: colors.textSecondary, lineHeight: 22 },
    infoRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: colors.border },
    infoLabel: { fontSize: 14, color: colors.textSecondary, fontWeight: '600' },
    availBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
    availText: { fontSize: 13, fontWeight: 'bold' },
    serviceCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: 16, padding: 14, marginBottom: 10, ...shadows.sm },
    serviceInfo: { flex: 1, marginRight: 12 },
    serviceName: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
    serviceDesc: { fontSize: 13, color: colors.textSecondary, marginTop: 3 },
    serviceMeta: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 6 },
    servicePrice: { fontSize: 16, fontWeight: 'bold', color: colors.primary },
    serviceDuration: { fontSize: 12, color: colors.textSecondary },
    bookServiceBtn: { backgroundColor: colors.primary, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12 },
    bookServiceBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
    reviewCard: { backgroundColor: colors.surface, borderRadius: 14, padding: 14, marginBottom: 10, ...shadows.sm },
    reviewHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 10 },
    reviewAvatar: { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.primary + '20', justifyContent: 'center', alignItems: 'center' },
    reviewAvatarText: { fontSize: 16, fontWeight: 'bold', color: colors.primary },
    reviewerName: { fontSize: 14, fontWeight: '700', color: colors.textPrimary },
    reviewStars: { fontSize: 12, marginTop: 2 },
    reviewComment: { fontSize: 14, color: colors.textSecondary, lineHeight: 20 },
    emptyText: { textAlign: 'center', color: colors.textSecondary, padding: 24, fontSize: 15 },
    stickyFooter: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: colors.surface, padding: 16, borderTopWidth: 1, borderTopColor: colors.border },
    bookNowBtn: { backgroundColor: colors.primary, borderRadius: 16, paddingVertical: 16, alignItems: 'center' },
    bookNowText: { color: '#fff', fontSize: 17, fontWeight: 'bold' },
});

export default ProviderDetailScreen;
