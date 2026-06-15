import React, { useState } from 'react';
import { View, StyleSheet, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, IconButton } from 'react-native-paper';
import { colors, typography, spacing } from '../theme';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Chat'>;
  route: RouteProp<RootStackParamList, 'Chat'>;
};

const ChatScreen: React.FC<Props> = ({ navigation, route }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);

  const sendMessage = () => {
    if (message.trim()) {
      setMessages([...messages, { id: Date.now(), content: message, senderId: 1 }]);
      setMessage('');
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <FlatList data={messages} keyExtractor={(item) => item.id.toString()} contentContainerStyle={styles.messagesList} renderItem={({ item }) => (
        <View style={[styles.messageBubble, item.senderId === 1 ? styles.sentMessage : styles.receivedMessage]}>
          <Text style={styles.messageText}>{item.content}</Text>
        </View>
      )} />
      <View style={styles.inputContainer}>
        <TextInput value={message} onChangeText={setMessage} placeholder="Type a message..." style={styles.input} mode="outlined" />
        <IconButton icon="send" mode="contained" onPress={sendMessage} />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  messagesList: { padding: spacing.md },
  messageBubble: { maxWidth: '80%', padding: spacing.md, borderRadius: 16, marginBottom: spacing.sm },
  sentMessage: { alignSelf: 'flex-end', backgroundColor: colors.primary },
  receivedMessage: { alignSelf: 'flex-start', backgroundColor: colors.surface },
  messageText: { ...typography.body, color: colors.white },
  inputContainer: { flexDirection: 'row', padding: spacing.md, alignItems: 'center' },
  input: { flex: 1, marginRight: spacing.sm },
});

export default ChatScreen;
