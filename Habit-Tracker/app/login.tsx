// Adapted from IS4447 lecture and tutorial examples
import { useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { db } from '@/db/client';
import { userTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { HabitContext } from './_layout';
import FormField from '@/components/ui/form-field';
import PrimaryButton from '@/components/ui/primary-button';
import ScreenHeader from '@/components/ui/screen-header';

export default function LoginScreen() {
  const router = useRouter();
  const context = useContext(HabitContext);
  if (!context) return null;
  const { setUser } = context;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');
    if (!email.trim() || !password.trim()) {
      setError('Please enter email and password');
      return;
    }

    const users = await db.select().from(userTable).where(eq(userTable.email, email.toLowerCase()));

    if (users.length === 0) {
      setError('No account found with that email');
      return;
    }

    if (users[0].password !== password) {
      setError('Incorrect password');
      return;
    }

    setUser({ id: users[0].id, name: users[0].name, email: users[0].email });
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <ScreenHeader title="Habit Tracker" />

        <FormField label="Email" value={email} onChangeText={setEmail} />
        <FormField label="Password" value={password} onChangeText={setPassword} />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <PrimaryButton label="Login" onPress={handleLogin} />
        <View style={{ marginTop: 10 }}>
          <PrimaryButton label="Create Account" variant="secondary" onPress={() => router.push('/register')} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  form: {
    width: '100%',
    maxWidth: 350,
    paddingHorizontal: 20,
    gap: 12,
  },
  error: {
    color: 'red',
    marginVertical: 5,
  },
});