import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Text, Card, Button, Avatar, ActivityIndicator } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, typography, spacing, borderRadius, shadows } from '../theme';
import { useAuth } from '../context/AuthContext';
import ProfileListItem from '../components/ProfileListItem';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

const ProfileScreen: React.FC<Props> = ({ navigation }) => {
  const { user, logout, isLoading } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      navigation.replace('Login');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoggingOut(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.avatarWrapper}>
            {user?.profileImage ? (
              <Image source={{ uri: user.profileImage }} style={styles.avatarImage} />
            ) : (
              <Avatar.Text
                size={100}
                label={user?.name?.charAt(0).toUpperCase() || '?'}
                style={styles.avatar}
                labelStyle={styles.avatarLabel}
              />
            )}
            <TouchableOpacity
              style={styles.editIconBadge}
              onPress={() => navigation.navigate('EditProfile')}
            >
              <Icon name="camera" size={20} color={colors.white} />
            </TouchableOpacity>
          </View>

          <Text style={styles.userName}>{user?.name || 'User'}</Text>
          <Text style={styles.userEmail}>{user?.email || ''}</Text>

          <Button
            mode="outlined"
            onPress={() => navigation.navigate('EditProfile')}
            style={styles.editButton}
            contentStyle={styles.editButtonContent}
            labelStyle={styles.editButtonLabel}
          >
            Edit Profile
          </Button>
        </View>
      </View>

      {/* Stats Section */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>12</Text>
          <Text style={styles.statLabel}>Bookings</Text>
        </View>
        <View style={[styles.statItem, styles.statDivider]}>
          <Text style={styles.statValue}>8</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
        <View style={styles.statItem}>
          <View style={styles.ratingRow}>
            <Text style={styles.statValue}>4.8</Text>
            <Icon name="star" size={16} color={colors.accent} style={{ marginLeft: 2 }} />
          </View>
          <Text style={styles.statLabel}>Ratings</Text>
        </View>
      </View>

      <View style={styles.content}>
        {/* Profile Details Card */}
        <Card style={styles.detailsCard}>
          <Card.Content>
            <View style={styles.detailItem}>
              <Icon name="phone" size={22} color={colors.primary} />
              <View style={styles.detailTextContainer}>
                <Text style={styles.detailLabel}>Phone Number</Text>
                <Text style={styles.detailValue}>{user?.phone || 'Not provided'}</Text>
              </View>
            </View>
            <View style={styles.detailItem}>
              <Icon name="map-marker" size={22} color={colors.primary} />
              <View style={styles.detailTextContainer}>
                <Text style={styles.detailLabel}>Location</Text>
                <Text style={styles.detailValue}>{user?.address || 'Set your location'}</Text>
              </View>
            </View>
            <View style={[styles.detailItem, { borderBottomWidth: 0 }]}>
              <Icon name="shield-account" size={22} color={colors.primary} />
              <View style={styles.detailTextContainer}>
                <Text style={styles.detailLabel}>Account Role</Text>
                <Text style={styles.detailValue}>{user?.role || 'USER'}</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Action List Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dashboard</Text>
          <ProfileListItem
            icon="calendar-month"
            title="My Bookings"
            onPress={() => navigation.navigate('Bookings' as any)}
          />
          <ProfileListItem
            icon="heart"
            title="Saved Services"
            onPress={() => { }}
          />
          <ProfileListItem
            icon="bell-ring"
            title="Notifications"
            onPress={() => { }}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Application</Text>
          <ProfileListItem
            icon="cog"
            title="Settings"
            onPress={() => { }}
          />
          <ProfileListItem
            icon="help-circle"
            title="Help & Support"
            onPress={() => { }}
          />
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          disabled={loggingOut}
        >
          {loggingOut ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <>
              <Icon name="logout" size={22} color={colors.white} style={{ marginRight: spacing.sm }} />
              <Text style={styles.logoutText}>Logout</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: spacing.xxl,
    paddingBottom: spacing.lg,
    backgroundColor: colors.surface,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    ...shadows.md,
  },
  headerContent: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: spacing.md,
  },
  avatar: {
    backgroundColor: colors.primary,
    ...shadows.md,
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    ...shadows.md,
  },
  avatarLabel: {
    fontSize: 42,
    fontWeight: 'bold',
  },
  editIconBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.secondary,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.surface,
  },
  userName: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  userEmail: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  editButton: {
    borderRadius: borderRadius.full,
    borderColor: colors.primary,
    borderWidth: 1.5,
  },
  editButtonContent: {
    paddingHorizontal: spacing.md,
  },
  editButtonLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    marginHorizontal: spacing.lg,
    marginTop: -spacing.lg,
    borderRadius: borderRadius.xl,
    paddingVertical: spacing.md,
    ...shadows.md,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statDivider: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: colors.border,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  content: {
    padding: spacing.lg,
  },
  detailsCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border + '50',
  },
  detailTextContainer: {
    marginLeft: spacing.md,
  },
  detailLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  detailValue: {
    fontSize: 15,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.sm,
    marginLeft: spacing.xs,
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: colors.error,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.xxl,
    ...shadows.md,
  },
  logoutText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
