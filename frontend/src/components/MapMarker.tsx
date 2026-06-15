import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Linking } from 'react-native';
import { Text } from 'react-native-paper';
import { Marker, Callout } from './MapComponents';
import { premiumColors, shadows, typography, colors } from '../theme';

interface MapMarkerProps {
    coordinate: {
        latitude: number;
        longitude: number;
    };
    title: string;
    category: string;
    profileImage?: string;
    rating?: number;
    phone?: string;
    address?: string;
    onPress?: () => void;
    children?: React.ReactNode;
}

const MapMarker: React.FC<MapMarkerProps> = ({ coordinate, title, category, profileImage, rating, phone, address, onPress, children }) => {
    return (
        <Marker
            coordinate={coordinate}
            onPress={onPress}
            tracksViewChanges={false}
        >
            <View style={styles.markerContainer}>
                <View style={styles.bubble}>
                    {profileImage ? (
                        <Image source={{ uri: profileImage }} style={styles.markerImage} />
                    ) : (
                        <Text style={styles.icon}>{category.charAt(0)}</Text>
                    )}
                </View>
                <View style={styles.arrow} />
            </View>

            <Callout tooltip>
                <View style={styles.calloutContainer}>
                    <View style={styles.calloutContent}>
                        {profileImage && (
                            <Image source={{ uri: profileImage }} style={styles.calloutImage} />
                        )}
                        <View style={styles.calloutInfo}>
                            <Text style={styles.calloutTitle} numberOfLines={1}>{title}</Text>
                            <Text style={styles.calloutCategory}>{category}</Text>
                            <View style={styles.ratingRow}>
                                <Text style={styles.ratingText}>⭐ {rating || '0.0'}</Text>
                            </View>
                            <Text style={styles.phoneText}>{phone}</Text>
                            <Text style={styles.addressText} numberOfLines={2}>{address}</Text>
                        </View>
                    </View>
                    <View style={styles.calloutActions}>
                        <TouchableOpacity
                            style={[styles.calloutBtn, { backgroundColor: colors.primary }]}
                            onPress={() => Linking.openURL(`tel:${phone}`)}
                        >
                            <Text style={styles.btnText}>Call Now</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.calloutBtn, { backgroundColor: colors.secondary, marginLeft: 8 }]}
                            onPress={() => Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${coordinate.latitude},${coordinate.longitude}`)}
                        >
                            <Text style={styles.btnText}>Directions</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Callout>
            {children}
        </Marker>
    );
};

const styles = StyleSheet.create({
    markerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 40,
        height: 50,
    },
    bubble: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: premiumColors.vibrantIndigo,
        borderWidth: 2,
        borderColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        ...shadows.md,
    },
    icon: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    markerImage: {
        width: 36,
        height: 36,
        borderRadius: 18,
    },
    arrow: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 6,
        borderRightWidth: 6,
        borderBottomWidth: 10,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: '#FFFFFF',
        transform: [{ rotate: '180deg' }],
        marginTop: -2,
    },
    calloutContainer: {
        width: 200,
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 12,
        ...shadows.lg,
    },
    calloutContent: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    calloutImage: {
        width: 40,
        height: 40,
        borderRadius: 8,
        marginRight: 8,
    },
    calloutInfo: {
        flex: 1,
    },
    calloutTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1E293B',
    },
    calloutCategory: {
        fontSize: 10,
        color: premiumColors.indigo,
        fontWeight: '600',
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
    },
    ratingText: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#475569',
    },
    phoneText: {
        fontSize: 10,
        color: '#64748B',
        marginTop: 2,
    },
    addressText: {
        fontSize: 9,
        color: '#94A3B8',
        marginTop: 2,
    },
    calloutActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    calloutBtn: {
        flex: 1,
        paddingVertical: 6,
        borderRadius: 8,
        alignItems: 'center',
    },
    btnText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    },
});

export default MapMarker;
