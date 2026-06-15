import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, TextInput, Button, Card } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, typography, spacing, borderRadius } from '../theme';
import { useAuth } from '../context/AuthContext';
import { RootStackParamList } from '../types/navigation';

type Props = { navigation: NativeStackNavigationProp<RootStackParamList>; };

const EditProfileScreen: React.FC<Props> = ({ navigation }) => {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateUser({ name, phone, address });
      navigation.goBack();
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.title}>Edit Profile</Text>
          <TextInput label="Full Name" value={name} onChangeText={setName} mode="outlined" style={styles.input} />
          <TextInput label="Phone" value={phone} onChangeText={setPhone} mode="outlined" style={styles.input} keyboardType="phone-pad" />
          <TextInput label="Address" value={address} onChangeText={setAddress} mode="outlined" style={styles.input} multiline />
          <Button mode="contained" onPress={handleSave} loading={loading} disabled={loading} style={styles.button} contentStyle={styles.buttonContent}>
            Save Changes
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.md },
  card: { borderRadius: borderRadius.lg, backgroundColor: colors.surface },
  title: { ...typography.h2, marginBottom: spacing.lg },
  input: { marginBottom: spacing.md, backgroundColor: colors.surface },
  button: { marginTop: spacing.md, borderRadius: borderRadius.md },
  buttonContent: { paddingVertical: spacing.sm },
});

export default EditProfileScreen;
