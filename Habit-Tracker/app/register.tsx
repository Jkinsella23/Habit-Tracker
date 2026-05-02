// Adapted from IS4447 lecture and tutorial examples
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { db } from '@/db/client';
import { userTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import FormField from '@/components/ui/form-field';
import PrimaryButton from '@/components/ui/primary-button';
import ScreenHeader from '@/components/ui/screen-header';

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async () => {
    setError('');
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    const existing = await db.select().from(userTable).where(eq(userTable.email, email));
    if (existing.length > 0) {
      setError('An account with that email already exists');
      return;
    }
    await db.insert(userTable).values({
      name,
      email: email.toLowerCase(),
      password,
    });
    router.replace('/login');
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <ScreenHeader title="Create Account" />

        <FormField label="Name" value={name} onChangeText={setName} />
        <FormField label="Email" value={email} onChangeText={setEmail} />
        <FormField label="Password" value={password} onChangeText={setPassword} secureTextEntry={true} />        
        <FormField label="Confirm Password" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry={true} />
        {error ? <Text style={styles.error}>{error}</Text> : null}

        <PrimaryButton label="Register" onPress={handleRegister} />
        <View style={{ marginTop: 10 }}>
          <PrimaryButton label="Back to Login" variant="secondary" onPress={() => router.back()} />
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