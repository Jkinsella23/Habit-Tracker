import { useLocalSearchParams, useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import { Button, Text, TextInput, View } from 'react-native';
import { db } from '@/db/client';
import { habitsTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { HabitContext, Habit } from '../_layout';

// Adapted from IS4447 student/[id].tsx example modified for habits

export default function HabitDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const context = useContext(HabitContext);
  if (!context) return null;
  const { habits, setHabits } = context;

  const habit = habits.find((h: Habit) => h.id === Number(id));
  if (!habit) return null;

  const [name, setName] = useState(habit.name);
  const [goal, setGoal] = useState(habit.goal.toString());
  const [unit, setUnit] = useState(habit.unit || '');

  const saveChanges = async () => {
    await db.update(habitsTable)
      .set({ name, goal: Number(goal), unit })
      .where(eq(habitsTable.id, Number(id)));

    const rows = await db.select().from(habitsTable);
    setHabits(rows);
    router.back();
  };

  const deleteHabit = async () => {
    await db.delete(habitsTable)
      .where(eq(habitsTable.id, Number(id)));

    const rows = await db.select().from(habitsTable);
    setHabits(rows);
    router.back();
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 22, marginBottom: 10 }}>Edit Habit</Text>

      <TextInput value={name} onChangeText={setName}
        style={{ borderWidth: 1, marginVertical: 5, padding: 10 }} />

      <TextInput value={goal} onChangeText={setGoal} keyboardType="numeric"
        style={{ borderWidth: 1, marginVertical: 5, padding: 10 }} />

      <TextInput value={unit} onChangeText={setUnit}
        style={{ borderWidth: 1, marginVertical: 5, padding: 10 }} />

      <Button title="Save Changes" onPress={saveChanges} />
      <Button title="Delete" onPress={deleteHabit} />
      <Button title="Back" onPress={() => router.back()} />
    </View>
  );
}