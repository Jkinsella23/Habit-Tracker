// Adapted from IS4447 lecture and tutorial examples
// Pressable used for selectable habit buttons - same pattern as add.tsx
import { useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { db } from '@/db/client';
import { habitLogsTable } from '@/db/schema';
import { HabitContext, Habit } from '../_layout';
import { SafeAreaView } from 'react-native-safe-area-context';
import FormField from '@/components/ui/form-field';
import PrimaryButton from '@/components/ui/primary-button';
import ScreenHeader from '@/components/ui/screen-header';

export default function LogHabit() {
  const router = useRouter();
  const context = useContext(HabitContext);
  if (!context) return null;
  const { habits, setLogs } = context;
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
    const updatedLogs = await db.select().from(habitLogsTable);
    setLogs(updatedLogs);
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenHeader title="Log Habit" subtitle={`Date: ${today}`} />

        <Text style={styles.sectionLabel}>Select Habit:</Text>
        <View style={styles.filterRow}>
          {habits.map((habit: Habit) => (
            <Pressable
              key={habit.id}
              onPress={() => setSelectedHabitID(habit.id)}
              style={[styles.filterButton, selectedHabitID === habit.id && styles.filterButtonSelected]}>
              <Text style={[styles.filterButtonText, selectedHabitID === habit.id && styles.filterButtonTextSelected]}>
                {habit.name}
              </Text>
            </Pressable>
          ))}
        </View>

        {selectedHabit && (
          <Text style={styles.goalText}>
            Goal: {selectedHabit.goal} {selectedHabit.unit}
          </Text>
        )}

        <FormField label="Value" value={value} onChangeText={setValue} />
        <FormField label="Notes (optional)" value={notes} onChangeText={setNotes} />

        <PrimaryButton label="Save Log" onPress={saveLog} />
        <View style={{ marginTop: 10 }}>
          <PrimaryButton label="Cancel" variant="secondary" onPress={() => router.back()} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    padding: 20,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
  },
  goalText: {
    color: '#6B7280',
    marginBottom: 10,
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