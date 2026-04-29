import { useContext } from 'react';
import { Button, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { HabitContext } from '../_layout';
import { db } from '@/db/client';
import { userTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
// Adapted from IS4447 lecture and tutorial examples

export default function SettingsScreen() {
  const context = useContext(HabitContext);
  if (!context) return null;
  const { user, setUser } = context;
  const router = useRouter();

  const handleLogout = () => {
    setUser(null);
    router.replace('/login');
  };

  const handleDeleteProfile = async () => {
    if (!user) return;
    await db.delete(userTable).where(eq(userTable.id, user.id));
    setUser(null);
    router.replace('/login');
  };

  return (
    <SafeAreaView style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 22, marginBottom: 20 }}>Settings</Text>

      <Text style={{ fontSize: 16, marginBottom: 20 }}>
        Logged in as: {user?.name} ({user?.email})
      </Text>

      <Button title="Logout" onPress={handleLogout} />

      <View style={{ marginTop: 20 }}>
        <Button title="Delete Profile" onPress={handleDeleteProfile} color="red" />
      </View>
    </SafeAreaView>
  );
}