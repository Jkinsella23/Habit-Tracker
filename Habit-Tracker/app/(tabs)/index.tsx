import { useContext } from 'react';
import { Text, ScrollView, Button, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HabitContext, Habit } from '../_layout';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const context = useContext(HabitContext);
  if (!context) return null;
  const { habits, user } = context;
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={{ fontSize: 24, marginBottom: 10 }}>
          Hi {user?.name || 'there'}!
        </Text>
        <Button title="Add Habit" onPress={() => router.push('/habit/add')} />
        <Button title="Log Habit" onPress={() => router.push('/habit/log')} />
        {habits.length === 0 ? (
          <Text>No habits added yet.</Text>
        ) : (
          habits.map((habit: Habit) => (
            <TouchableOpacity
              key={habit.id}
              onPress={() => router.push({ pathname: '/habit/[id]' as any, params: { id: habit.id.toString() } })}              style={{ marginBottom: 12, padding: 10, borderWidth: 1 }}>
              <Text style={{ fontSize: 18 }}>{habit.name}</Text>
              <Text>Goal: {habit.goal} {habit.unit}</Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}