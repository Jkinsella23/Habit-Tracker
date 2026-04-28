import { useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import { Button, Text, TextInput, View, TouchableOpacity, ScrollView } from 'react-native';
import { db } from '@/db/client';
import { habitLogsTable } from '@/db/schema';
import { HabitContext, Habit } from '../_layout';

// Touchableopacity concept used from the add.tsx screen, used to show the user which is clicked as buttons are not desingable compared to how touchableopacity allows for the colour changes 
// adapted content from IS4447 lecture and tutorial examples. 

export default function LogHabit() {
  const router = useRouter();
  const context = useContext(HabitContext);
  if (!context) return null;
  const { habits } = context;

  const [selectedHabitID, setSelectedHabitID] = useState<number | null>(null);
  const [value, setValue] = useState('');
  const [notes, setNotes] = useState('');

  const today = new Date().toISOString().split('T')[0];

  const selectedHabit = habits.find((h: Habit) => h.id === selectedHabitID);

  const saveLog = async () => {
    if (!selectedHabitID || !value.trim()) return;

    await db.insert(habitLogsTable).values({
      habitID: selectedHabitID,
      date: today,
      value: Number(value),
      notes: notes.trim() || null,
    });

    router.back();
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text style={{ fontSize: 22, marginBottom: 10 }}>Log Habit</Text>

      <Text style={{ marginTop: 10, marginBottom: 5 }}>Select Habit:</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10 }}>
        {habits.map((habit: Habit) => (
          <TouchableOpacity
            key={habit.id}
            onPress={() => setSelectedHabitID(habit.id)}
            style={{ padding: 10, marginRight: 5, marginBottom: 5, borderWidth: 1, backgroundColor: selectedHabitID === habit.id ? '#2196F3' : 'white' }}>
            <Text style={{ color: selectedHabitID === habit.id ? 'white' : 'black' }}>{habit.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {selectedHabit && (
        <Text style={{ marginBottom: 10, color: 'gray' }}>
          Goal: {selectedHabit.goal} {selectedHabit.unit}
        </Text>
      )}

      <TextInput
        placeholder="Value"
        value={value}
        onChangeText={setValue}
        keyboardType="numeric"
        style={{ borderWidth: 1, marginVertical: 5, padding: 10 }}
      />

      <TextInput
        placeholder="Notes (optional)"
        value={notes}
        onChangeText={setNotes}
        style={{ borderWidth: 1, marginVertical: 5, padding: 10 }}
      />

      <Text style={{ marginBottom: 10, color: 'gray' }}>Date: {today}</Text>

      <Button title="Save Log" onPress={saveLog} disabled={!selectedHabitID || !value.trim()} />
    </ScrollView>
  );
}