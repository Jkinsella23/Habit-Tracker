// Adapted from IS4447 lecture and tutorial examples
import { useContext } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { HabitContext } from '../_layout';
import { db } from '@/db/client';
import { userTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import PrimaryButton from '@/components/ui/primary-button';
import ScreenHeader from '@/components/ui/screen-header';

export default function SettingsScreen() {
  const context = useContext(HabitContext);
  if (!context) return null;
  const { user, setUser } = context;
  const router = useRouter();

  const handleLogout = () => {
    setUser(null);
    router.replace('/login');
  };

  const handleDeleteProfile = () => {
    Alert.alert(
      'Delete Account',
      'This will permanently delete your account and all data.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          onPress: async () => {
            if (!user) return;
            await db.delete(userTable).where(eq(userTable.id, user.id));
            setUser(null);
            router.replace('/login');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader title="Settings" />

      <View style={styles.card}>
        <Text style={styles.label}>Name</Text>
        <Text style={styles.value}>{user?.name}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{user?.email}</Text>
      </View>

      <PrimaryButton label="Logout" onPress={handleLogout} />

      <View style={styles.buttonSpacing}>
        <PrimaryButton label="Delete Account" variant="danger" onPress={handleDeleteProfile} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 18,
    paddingTop: 10,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
  },
  label: {
    color: '#6B7280',
    fontSize: 14,
  },
  value: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 4,
  },
  buttonSpacing: {
    marginTop: 10,
  },
});