// Adapted from IS4447 lecture and tutorial examples
// TouchableOpacity used for selectable buttons - allows custom styling to highlight selected option
// Reference: https://reactnative.dev/docs/touchableopacity
import { useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { db } from '@/db/client';
import { habitsTable } from '@/db/schema';
import { HabitContext } from '../_layout';
import { SafeAreaView } from 'react-native-safe-area-context';
import FormField from '@/components/ui/form-field';
import PrimaryButton from '@/components/ui/primary-button';
import ScreenHeader from '@/components/ui/screen-header';

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
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader title="Add Habit" subtitle="Create a new habit" />

      <FormField label="Name" value={name} onChangeText={setName} />
      <FormField label="Goal" value={goal} onChangeText={setGoal} />

      <Text style={styles.sectionLabel}>Unit:</Text>
      <View style={styles.filterRow}>
        {units.map((u) => (
          <Pressable
            key={u}
            onPress={() => setUnit(u)}
            style={[styles.filterButton, unit === u && styles.filterButtonSelected]}>
            <Text style={[styles.filterButtonText, unit === u && styles.filterButtonTextSelected]}>{u}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.sectionLabel}>Category:</Text>
      <View style={styles.filterRow}>
        {categories.map((cat) => (
          <Pressable
            key={cat.id}
            onPress={() => setCategoryID(cat.id)}
            style={[styles.filterButton, categoryID === cat.id && styles.filterButtonSelected]}>
            <Text style={[styles.filterButtonText, categoryID === cat.id && styles.filterButtonTextSelected]}>{cat.name}</Text>
          </Pressable>
        ))}
      </View>

      <PrimaryButton label="Save Habit" onPress={saveHabit} />
      <View style={{ marginTop: 10 }}>
        <PrimaryButton label="Cancel" variant="secondary" onPress={() => router.back()} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F8FAFC',
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  filterButton: {
    backgroundColor: '#FFFFFF',
    borderColor: '#94A3B8',
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  filterButtonSelected: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
  filterButtonText: {
    color: '#0F172A',
    fontSize: 14,
    fontWeight: '500',
  },
  filterButtonTextSelected: {
    color: '#FFFFFF',
  },
});