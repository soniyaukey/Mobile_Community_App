import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
    View, StyleSheet, FlatList, TouchableOpacity, Linking, Platform,
    ScrollView, Animated, Dimensions, Image, Modal
} from 'react-native';
import { Text, Searchbar, ActivityIndicator } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import MapView from '../components/MapComponents';
import MapMarker from '../components/MapMarker';
import WebMap from '../components/WebMap';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, serviceCategories, premiumColors } from '../theme';
import apiService from '../services/api';
import { Provider } from '../types';
import { RootStackParamList } from '../types/navigation';

const { width, height } = Dimensions.get('window');

const NearbyServicesScreen: React.FC<{ navigation?: NativeStackNavigationProp<RootStackParamList> }> = ({ navigation: navProp }) => {
    const navHook = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const navigation = navProp ?? navHook;

    const [providers, setProviders] = useState<Provider[]>([]);
    const [allProviders, setAllProviders] = useState<Provider[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [radius, setRadius] = useState(5);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [mapRegion, setMapRegion] = useState({
        latitude: 12.9716,
        longitude: 77.5946,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
    });

    const flatListRef = useRef<FlatList>(null);
    const popupAnim = useRef(new Animated.Value(height)).current;

    const showPopup = (provider: Provider) => {
        setSelectedProvider(provider);
        setIsPopupVisible(true);
        Animated.spring(popupAnim, { toValue: 0, useNativeDriver: true, tension: 65, friction: 11 }).start();
    };

    const hidePopup = () => {
        Animated.timing(popupAnim, { toValue: height, duration: 250, useNativeDriver: true }).start(() => {
            setIsPopupVisible(false);
            setSelectedProvider(null);
        });
    };

    const applyFilters = useCallback((data: Provider[], category: string | null, query: string) => {
        let filtered = data;
        if (category) filtered = filtered.filter((p) => p.serviceCategory === category);
        if (query.trim()) {
            const q = query.toLowerCase();
            filtered = filtered.filter((p) =>
                p.businessName.toLowerCase().includes(q) || p.serviceCategory.toLowerCase().includes(q)
            );
        }
        filtered = filtered.sort((a, b) => (a.distance || 0) - (b.distance || 0)).slice(0, 6);
        setProviders(filtered);
    }, []);

    const fetchNearbyProviders = useCallback(async (lat: number, lng: number) => {
        try {
            setIsLoading(true);
            const data = await apiService.getNearbyProviders(lat, lng, radius);
            setAllProviders(data);
            applyFilters(data, selectedCategory, searchQuery);
        } catch (error) {
            console.error('Error fetching nearby providers:', error);
            setProviders([]);
        } finally {
            setIsLoading(false);
        }
    }, [radius, applyFilters]);

    useEffect(() => {
        applyFilters(allProviders, selectedCategory, searchQuery);
    }, [selectedCategory, searchQuery]);

    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                fetchNearbyProviders(12.9716, 77.5946);
                return;
            }
            const loc = await Location.getCurrentPositionAsync({});
            setMapRegion({
                latitude: loc.coords.latitude,
                longitude: loc.coords.longitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
            });
            fetchNearbyProviders(loc.coords.latitude, loc.coords.longitude);
        })();
    }, [radius]);

    const onMarkerPress = (provider: Provider) => {
        setMapRegion((r) => ({
            ...r,
            latitude: provider.latitude || r.latitude,
            longitude: provider.longitude || r.longitude,
        }));
        showPopup(provider);
    };

    const renderProviderCard = ({ item }: { item: Provider }) => (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => navigation.navigate('ProviderDetail', { providerId: item.id })}
            style={styles.cardContainer}
        >
            <View style={styles.premiumCard}>
                <BlurView intensity={Platform.OS === 'android' ? 40 : 25} style={StyleSheet.absoluteFill} tint="light" />
                <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(255,255,255,0.45)' }]} />
                <View style={styles.cardHeader}>
                    {item.profileImage ? (
                        <Image source={{ uri: item.profileImage }} style={styles.providerThumbnail} />
                    ) : (
                        <View style={[styles.providerThumbnail, styles.avatarFallback]}>
                            <Text style={styles.avatarInitial}>{item.businessName?.charAt(0) || '?'}</Text>
                        </View>
                    )}
                    <View style={styles.providerInfo}>
                        <Text style={styles.businessName} numberOfLines={1}>{item.businessName}</Text>
                        <Text style={styles.categoryText}>{item.serviceCategory}</Text>
                    </View>
                    <View style={styles.distanceBadge}>
                        <Text style={styles.distanceText}>
                            {typeof item.distance === 'number' ? item.distance.toFixed(1) : '0'} km
                        </Text>
                    </View>
                </View>
                <View style={styles.divider} />
                <View style={styles.cardFooter}>
                    <Text style={styles.ratingText}>
                        {'\u2B50'} {item.rating?.toFixed(1) || '0.0'} ({item.totalReviews || 0})
                    </Text>
                    <View style={[styles.availBadge, {
                        backgroundColor: item.availability === 'Busy' ? '#FEE2E2' : '#D1FAE5'
                    }]}>
                        <Text style={[styles.availText, {
                            color: item.availability === 'Busy' ? colors.error : colors.secondary
                        }]}>
                            {item.availability || 'Available'}
                        </Text>
                    </View>
                    <TouchableOpacity onPress={() => Linking.openURL(`tel:${item.phone || ''}`)}>
                        <View style={styles.callBtn}>
                            <Text style={styles.callBtnText}>Call</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
{Platform.OS === 'web' ? (
                <WebMap providers={providers.map(p => ({latitude: p.latitude || 12.97, longitude: p.longitude || 77.59, title: p.businessName}))} region={mapRegion} />
            ) : (
                <MapView
                    style={styles.map}
                    region={mapRegion}
                    showsUserLocation
                    onRegionChangeComplete={setMapRegion}
                >
                    {providers.map((p) => (
                        <MapMarker
                            key={p.id}
                            coordinate={{ latitude: p.latitude || mapRegion.latitude, longitude: p.longitude || mapRegion.longitude }}
                            title={p.businessName}
                            category={p.serviceCategory}
                            profileImage={p.profileImage}
                            phone={p.phone}
                            rating={p.rating}
                            address={p.address}
                            onPress={() => onMarkerPress(p)}
                        />
                    ))}
                </MapView>
            )}

            {/* Top overlay */}
            <View style={styles.topContainer}>
                <LinearGradient
                    colors={['rgba(15,23,42,0.85)', 'transparent']}
                    style={styles.topGradient}
                />
                <View style={styles.topBar}>
                    <Searchbar
                        placeholder="Search services..."
                        style={styles.searchBar}
                        inputStyle={{ minHeight: 44 }}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                <View style={styles.radiusBar}>
                    <Text style={styles.radiusLabel}>Radius:</Text>
                    {[1, 5, 10].map((r) => (
                        <TouchableOpacity
                            key={r}
                            onPress={() => setRadius(r)}
                            style={[styles.radiusChip, radius === r && styles.radiusChipActive]}
                        >
                            <Text style={[styles.radiusChipText, radius === r && styles.radiusChipTextActive]}>
                                {r} km
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.catScroll}
                    contentContainerStyle={{ paddingHorizontal: 12 }}
                >
                    <TouchableOpacity
                        onPress={() => setSelectedCategory(null)}
                        style={[styles.catChip, !selectedCategory && styles.catChipActive]}
                    >
                        <Text style={[styles.catChipText, !selectedCategory && styles.catChipTextActive]}>All</Text>
                    </TouchableOpacity>
                    {serviceCategories.map((cat) => (
                        <TouchableOpacity
                            key={cat.id}
                            onPress={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                            style={[styles.catChip, selectedCategory === cat.id && styles.catChipActive]}
                        >
                            <Text style={[styles.catChipText, selectedCategory === cat.id && styles.catChipTextActive]}>
                                {cat.icon} {cat.name}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Bottom provider cards */}
            <View style={styles.bottomContainer}>
                {isLoading ? (
                    <View style={styles.statusCard}>
                        <ActivityIndicator color={colors.primary} />
                        <Text style={styles.statusText}>Finding providers...</Text>
                    </View>
                ) : providers.length === 0 ? (
                    <View style={styles.statusCard}>
                        <Text style={styles.statusText}>No providers found nearby</Text>
                    </View>
                ) : (
                    <FlatList
                        ref={flatListRef}
                        data={providers}
                        renderItem={renderProviderCard}
                        keyExtractor={(p) => p.id.toString()}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        snapToInterval={width * 0.82}
                        decelerationRate="fast"
                        contentContainerStyle={{ paddingHorizontal: width * 0.09 }}
                    />
                )}
            </View>

            {/* Marker popup bottom sheet */}
            {isPopupVisible && selectedProvider && (
                <Modal
                    transparent
                    animationType="none"
                    visible={isPopupVisible}
                    onRequestClose={hidePopup}
                >
                    <TouchableOpacity style={styles.popupOverlay} activeOpacity={1} onPress={hidePopup} />
                    <Animated.View style={[styles.popupSheet, { transform: [{ translateY: popupAnim }] }]}>
                        <View style={styles.popupHandle} />
                        <View style={styles.popupHeader}>
                            {selectedProvider.profileImage ? (
                                <Image source={{ uri: selectedProvider.profileImage }} style={styles.popupAvatar} />
                            ) : (
                                <View style={[styles.popupAvatar, styles.avatarFallback]}>
                                    <Text style={styles.avatarInitial}>
                                        {selectedProvider.businessName?.charAt(0) || '?'}
                                    </Text>
                                </View>
                            )}
                            <View style={{ flex: 1, marginLeft: 14 }}>
                                <Text style={styles.popupName}>{selectedProvider.businessName}</Text>
                                <Text style={styles.popupCategory}>{selectedProvider.serviceCategory}</Text>
                                <Text style={styles.popupRating}>
                                    {'\u2B50'} {selectedProvider.rating?.toFixed(1)} ({selectedProvider.totalReviews} reviews)
                                    {'  \u{1F4CD}'} {typeof selectedProvider.distance === 'number'
                                        ? selectedProvider.distance.toFixed(1) : '0'} km
                                </Text>
                            </View>
                        </View>

                        {selectedProvider.description ? (
                            <Text style={styles.popupDesc} numberOfLines={3}>
                                {selectedProvider.description}
                            </Text>
                        ) : null}

                        <View style={styles.popupInfoRow}>
                            {selectedProvider.hourlyRate ? (
                                <View style={styles.popupInfoChip}>
                                    <Text style={styles.popupInfoText}>Rs.{selectedProvider.hourlyRate}/hr</Text>
                                </View>
                            ) : null}
                            {selectedProvider.experience ? (
                                <View style={styles.popupInfoChip}>
                                    <Text style={styles.popupInfoText}>{selectedProvider.experience}</Text>
                                </View>
                            ) : null}
                            <View style={[styles.popupInfoChip, {
                                backgroundColor: selectedProvider.availability === 'Busy' ? '#FEE2E2' : '#D1FAE5'
                            }]}>
                                <Text style={[styles.popupInfoText, {
                                    color: selectedProvider.availability === 'Busy' ? colors.error : colors.secondary
                                }]}>
                                    {selectedProvider.availability || 'Available'}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.popupActions}>
                            <TouchableOpacity
                                style={styles.callAction}
                                onPress={() => Linking.openURL(`tel:${selectedProvider.phone || ''}`)}
                            >
                                <Text style={styles.callActionText}>Call</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.viewAction}
                                onPress={() => {
                                    hidePopup();
                                    navigation.navigate('ProviderDetail', { providerId: selectedProvider.id });
                                }}
                            >
                                <Text style={styles.viewActionText}>View Profile</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.bookAction}
                                onPress={() => {
                                    hidePopup();
                                    navigation.navigate('Booking', { providerId: selectedProvider.id });
                                }}
                            >
                                <Text style={styles.bookActionText}>Book Now</Text>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                </Modal>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    map: { ...StyleSheet.absoluteFillObject },
    webPlaceholder: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    topContainer: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 },
    topGradient: { ...StyleSheet.absoluteFillObject, height: 220 },
    topBar: { paddingHorizontal: 12, paddingTop: 52 },
    searchBar: { height: 48, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.95)', elevation: 8 },
    radiusBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, marginTop: 8 },
    radiusLabel: {
        color: 'white', fontWeight: '600', fontSize: 13, marginRight: 8,
        textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 2,
    },
    radiusChip: {
        paddingVertical: 4, paddingHorizontal: 12, borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.2)', marginRight: 8,
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)',
    },
    radiusChipActive: { backgroundColor: premiumColors.vibrantIndigo, borderColor: premiumColors.vibrantIndigo },
    radiusChipText: { color: 'white', fontSize: 12, fontWeight: '500' },
    radiusChipTextActive: { color: '#fff', fontWeight: 'bold' },
    catScroll: { marginTop: 8, marginBottom: 4 },
    catChip: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.9)', paddingHorizontal: 10, paddingVertical: 6,
        borderRadius: 16, marginRight: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)',
    },
    catChipActive: { backgroundColor: premiumColors.vibrantIndigo, borderColor: premiumColors.vibrantIndigo },
    catChipText: { fontSize: 13, fontWeight: '600', color: '#1E293B' },
    catChipTextActive: { color: '#fff' },
    bottomContainer: { position: 'absolute', bottom: 30, left: 0, right: 0 },
    statusCard: {
        backgroundColor: 'rgba(255,255,255,0.95)', marginHorizontal: 40,
        borderRadius: 20, padding: 24, alignItems: 'center',
    },
    statusText: { color: '#475569', marginTop: 8 },
    cardContainer: { width: width * 0.8, marginRight: 14 },
    premiumCard: {
        borderRadius: 22, padding: 16, minHeight: 140, justifyContent: 'space-between',
        shadowColor: '#000', shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25, shadowRadius: 16, elevation: 10, overflow: 'hidden',
    },
    cardHeader: { flexDirection: 'row', alignItems: 'center' },
    providerThumbnail: { width: 52, height: 52, borderRadius: 14, marginRight: 12 },
    avatarFallback: { backgroundColor: '#EEF2FF', justifyContent: 'center', alignItems: 'center' },
    avatarInitial: { fontSize: 22, fontWeight: 'bold', color: premiumColors.vibrantIndigo },
    providerInfo: { flex: 1 },
    businessName: { fontSize: 17, fontWeight: 'bold', color: '#0F172A' },
    categoryText: { fontSize: 12, color: '#64748B', marginTop: 2 },
    distanceBadge: {
        backgroundColor: premiumColors.vibrantIndigo + '20',
        paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12,
    },
    distanceText: { fontSize: 12, color: premiumColors.vibrantIndigo, fontWeight: 'bold' },
    divider: { height: 1, backgroundColor: '#E2E8F0', marginVertical: 10 },
    cardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    ratingText: { fontSize: 13, fontWeight: '600', color: '#475569' },
    availBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
    availText: { fontSize: 11, fontWeight: 'bold' },
    callBtn: { backgroundColor: '#EFF6FF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
    callBtnText: { color: colors.primary, fontSize: 12, fontWeight: '600' },
    // Popup
    popupOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' },
    popupSheet: {
        backgroundColor: '#fff', borderTopLeftRadius: 28, borderTopRightRadius: 28,
        padding: 20, paddingBottom: 36, position: 'absolute', bottom: 0, left: 0, right: 0,
        shadowColor: '#000', shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.15, shadowRadius: 20, elevation: 20,
    },
    popupHandle: { width: 40, height: 4, backgroundColor: '#CBD5E1', borderRadius: 2, alignSelf: 'center', marginBottom: 16 },
    popupHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
    popupAvatar: { width: 70, height: 70, borderRadius: 18 },
    popupName: { fontSize: 20, fontWeight: 'bold', color: '#0F172A' },
    popupCategory: { fontSize: 13, color: '#64748B', marginTop: 2 },
    popupRating: { fontSize: 13, color: '#475569', fontWeight: '600', marginTop: 6 },
    popupDesc: { fontSize: 14, color: '#64748B', lineHeight: 20, marginBottom: 12 },
    popupInfoRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
    popupInfoChip: { backgroundColor: '#F1F5F9', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
    popupInfoText: { fontSize: 13, color: '#475569', fontWeight: '600' },
    popupActions: { flexDirection: 'row', gap: 10 },
    callAction: { flex: 1, backgroundColor: '#EFF6FF', paddingVertical: 12, borderRadius: 14, alignItems: 'center' },
    callActionText: { color: colors.primary, fontWeight: '700', fontSize: 14 },
    viewAction: { flex: 1, backgroundColor: '#F1F5F9', paddingVertical: 12, borderRadius: 14, alignItems: 'center' },
    viewActionText: { color: '#475569', fontWeight: '700', fontSize: 14 },
    bookAction: { flex: 1, backgroundColor: premiumColors.vibrantIndigo, paddingVertical: 12, borderRadius: 14, alignItems: 'center' },
    bookActionText: { color: '#fff', fontWeight: '700', fontSize: 14 },
});

export default NearbyServicesScreen;
