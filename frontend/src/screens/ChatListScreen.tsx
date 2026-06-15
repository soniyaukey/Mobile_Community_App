import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, typography, spacing, borderRadius, shadows } from '../theme';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/api';
import { RootStackParamList } from '../types/navigation';

type Props = { navigation: NativeStackNavigationProp<RootStackParamList>; };

const ChatListScreen: React.FC<Props> = ({ navigation }) => {
  const { user } = useAuth();
  const [chats, setChats] = useState<any[]>([]);

  return (
    <View style={styles.container}>
      <View style={styles.header}><Text style={styles.title}>Messages</Text></View>
      <FlatList data={chats} keyExtractor={(item) => item.id.toString()} contentContainerStyle={styles.list} renderItem={({ item }) => (
        <TouchableOpacity onPress={() => navigation.navigate('Chat', { otherUserId: item.id })}>
          <Card style={styles.card}>
            <Card.Content style={styles.cardContent}>
              <View style={styles.avatar}><Text style={styles.avatarText}>{item.name?.charAt(0) || '?'}</Text></View>
              <View style={styles.chatInfo}><Text style={styles.chatName}>{item.name}</Text><Text style={styles.lastMessage}>{item.lastMessage || 'No messages'}</Text></View>
            </Card.Content>
          </Card>
        </TouchableOpacity>
      )} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { padding: spacing.lg, paddingTop: spacing.xxl, backgroundColor: colors.primary },
  title: { ...typography.h1, color: colors.white },
  list: { padding: spacing.md },
  card: { marginBottom: spacing.md, borderRadius: borderRadius.lg, backgroundColor: colors.surface, ...shadows.sm },
  cardContent: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center' },
  avatarText: { ...typography.h3, color: colors.white },
  chatInfo: { flex: 1, marginLeft: spacing.md },
  chatName: { ...typography.body, fontWeight: '600' },
  lastMessage: { ...typography.caption, color: colors.textSecondary },
});

export default ChatListScreen;
