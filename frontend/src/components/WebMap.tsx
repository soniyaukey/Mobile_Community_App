import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform } from 'react-native';

interface WebMapProps {
  providers: Array<{ latitude: number; longitude: number; title: string }>;
  region: { latitude: number; longitude: number; latitudeDelta: number; longitudeDelta: number };
}

const WebMap: React.FC<WebMapProps> = ({ providers, region }) => {
  // Normalize provider positions to SVG coords (center at user's location)
  const centerLat = region.latitude;
  const centerLng = region.longitude;
  const latRange = region.latitudeDelta * 0.8;
  const lngRange = region.longitudeDelta * 0.8;
  
  const getPinX = (lng: number) => {
    const normalizedLng = (lng - centerLng + lngRange / 2) / lngRange;
    return Math.max(20, Math.min(280, normalizedLng * 300));
  };
  
  const getPinY = (lat: number) => {
    const normalizedLat = (lat - centerLat + latRange / 2) / latRange;
    return Math.max(20, Math.min(180, normalizedLat * 200));
  };

  return (
    <View style={styles.container}>
      {/* Static Map Background */}
      <View style={styles.mapContainer}>
        <svg width="100%" height="100%" viewBox="0 0 320 220" style={styles.svg}>
          {/* City/Neighborhood Background */}
          <rect x="20" y="20" width="280" height="180" rx="20" fill="#E0F2FE" stroke="#0284C7" strokeWidth="3"/>
          {/* Roads/Grids */}
          <path d="M40 50 L280 50 M40 110 L280 110 M40 170 L280 170 M100 20 L100 200 M200 20 L200 200" 
                stroke="#B9D8F0" strokeWidth="2" strokeLinecap="round"/>
          {/* User Location Pin */}
          <circle cx="160" cy="110" r="12" fill="#10B981" stroke="white" strokeWidth="3"/>
          <text x="160" y="115" textAnchor="middle" fontSize="16" fontWeight="bold" fill="white">YOU</text>
          {/* Provider Pins */}
          {providers.map((p, i) => (
            <g key={i}>
              <circle cx={getPinX(p.longitude)} cy={getPinY(p.latitude)} r="10" fill="#EF4444" stroke="white" strokeWidth="3"/>
              <text x={getPinX(p.longitude)} y={getPinY(p.latitude) + 4} textAnchor="middle" fontSize="12" fontWeight="bold" fill="white">
                {p.title.charAt(0)}
              </text>
            </g>
          ))}
        </svg>
      </View>
      
      {/* Providers Count Badge */}
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{providers.length} providers nearby</Text>
      </View>
      
      {/* Scrollable Provider List */}
      {providers.length > 0 && (
        <ScrollView style={styles.listContainer} horizontal={true} showsHorizontalScrollIndicator={false}>
          {providers.slice(0, 5).map((p, i) => (
            <TouchableOpacity key={i} style={styles.providerPin}>
              <Text style={styles.pinTitle}>{p.title}</Text>
              <Text style={styles.pinDist}>~{(Math.random() * 5).toFixed(1)}km</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  mapContainer: { flex: 1, margin: 10, borderRadius: 20, overflow: 'hidden', backgroundColor: '#F0F9FF' },
  svg: { width: '100%', height: '100%' },
  badge: {
    position: 'absolute', top: 15, left: 15, backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4,
  },
  badgeText: { color: '#1E293B', fontWeight: 'bold', fontSize: 14 },
  listContainer: {
    position: 'absolute', bottom: 20, left: 20, right: 20, maxHeight: 80,
    backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: 16, padding: 10,
  },
  providerPin: {
    backgroundColor: '#F3F4F6', marginRight: 10, padding: 12, borderRadius: 12,
    minWidth: 100, alignItems: 'center', shadowColor: '#000', shadowOffset: {width:0,height:1},
    shadowOpacity: 0.1, shadowRadius: 2,
  },
  pinTitle: { fontWeight: '600', fontSize: 13, color: '#1E293B' },
  pinDist: { fontSize: 11, color: '#6B7280', marginTop: 2 },
});

export default WebMap;
