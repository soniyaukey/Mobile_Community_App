import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, spacing, borderRadius } from '../theme';

interface ProfileListItemProps {
    icon: string;
    title: string;
    onPress?: () => void;
    showArrow?: boolean;
}

const ProfileListItem: React.FC<ProfileListItemProps> = ({
    icon,
    title,
    onPress,
    showArrow = true
}) => {
    return (
        <TouchableOpacity
            style={styles.container}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.leftContent}>
                <View style={styles.iconContainer}>
                    <Icon name={icon} size={22} color={colors.primary} />
                </View>
                <Text style={styles.title}>{title}</Text>
            </View>
            {showArrow && (
                <Icon name="chevron-right" size={24} color={colors.textSecondary} />
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.md,
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        marginBottom: spacing.sm,
    },
    leftContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.primary + '10',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
    },
    title: {
        fontSize: 16,
        color: colors.textPrimary,
        fontWeight: '500',
    },
});

export default ProfileListItem;
