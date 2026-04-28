import { useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import { Button, Text, TextInput, View } from 'react-native';
import { db } from '@/db/client';
import { userTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { HabitContext } from './_layout';

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

    const users = await db.select().from(userTable).where(eq(userTable.email, email));

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
    <View style={{ flex: 1, padding: 20, justifyContent: 'center' }}>
      <Text style={{ fontSize: 28, marginBottom: 20 }}>Habit Tracker</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, marginVertical: 5, padding: 10 }}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, marginVertical: 5, padding: 10 }}
      />

      {error ? <Text style={{ color: 'red', marginVertical: 5 }}>{error}</Text> : null}

      <Button title="Login" onPress={handleLogin} />
      <Button title="Create Account" onPress={() => router.push('/register')} />
    </View>
  );
}