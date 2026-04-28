import { useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import { Button, Text, TextInput, View, TouchableOpacity } from 'react-native';
import { db } from '@/db/client';
import { habitsTable } from '@/db/schema';
import { HabitContext } from '../_layout';

// Adapted from IS4447 lecture and tutorial examples
// TouchableOpacity used for selectable buttons - allows custom styling to highlight selected option
// which is not possible with React Native's Button component
// Reference: https://reactnative.dev/docs/touchableopacity

export default function AddHabit() {
  const router = useRouter();
  const context = useContext(HabitContext);
  if (!context) return null;
  const { setHabits } = context;

  const [name, setName] = useState('');
  const [goal, setGoal] = useState('');
  const [unit, setUnit] = useState('');
  const [categoryID, setCategoryID] = useState(1);

  const categories = [
    { id: 1, name: 'Health' },
    { id: 2, name: 'Fitness' },
    { id: 3, name: 'Personal' },
  ];

  const units = ['steps', 'hours', 'ml', 'minutes'];

  const saveHabit = async () => {
    if (!name.trim() || !goal.trim() || !unit) return;

    await db.insert(habitsTable).values({
      name,
      type: 'number',
      goal: Number(goal),
      unit,
      categoryID,
    });

    const rows = await db.select().from(habitsTable);
    setHabits(rows);
    router.back();
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 22, marginBottom: 10 }}>Add Habit</Text>

      <TextInput placeholder="Name" value={name} onChangeText={setName}
        style={{ borderWidth: 1, marginVertical: 5, padding: 10 }} />

      <TextInput placeholder="Goal" value={goal} onChangeText={setGoal} keyboardType="numeric"
        style={{ borderWidth: 1, marginVertical: 5, padding: 10 }} />

      <Text style={{ marginTop: 10, marginBottom: 5 }}>Unit:</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10 }}>
        {units.map((u) => (
          <TouchableOpacity
            key={u}
            onPress={() => setUnit(u)}
            style={{ padding: 10, marginRight: 5, marginBottom: 5, borderWidth: 1, backgroundColor: unit === u ? '#2196F3' : 'white' }}>
            <Text style={{ color: unit === u ? 'white' : 'black' }}>{u}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={{ marginTop: 10, marginBottom: 5 }}>Category:</Text>
      <View style={{ flexDirection: 'row', marginBottom: 10 }}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            onPress={() => setCategoryID(cat.id)}
            style={{ padding: 10, marginRight: 5, borderWidth: 1, backgroundColor: categoryID === cat.id ? '#2196F3' : 'white' }}>
            <Text style={{ color: categoryID === cat.id ? 'white' : 'black' }}>{cat.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Button title="Save" onPress={saveHabit} disabled={!name.trim()} />
    </View>
  );
}