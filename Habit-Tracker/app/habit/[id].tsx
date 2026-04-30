// Adapted from IS4447 student/[id].tsx example - modified for habits
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { db } from '@/db/client';
import { habitsTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { HabitContext, Habit } from '../_layout';
import { SafeAreaView } from 'react-native-safe-area-context';
import FormField from '@/components/ui/form-field';
import PrimaryButton from '@/components/ui/primary-button';
import ScreenHeader from '@/components/ui/screen-header';
import InfoTag from '@/components/ui/info-tag';

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

  const deleteHabit = () => {
    Alert.alert(
      'Delete Habit',
      'Are you sure you want to delete this habit?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          onPress: async () => {
            await db.delete(habitsTable)
              .where(eq(habitsTable.id, Number(id)));

            const rows = await db.select().from(habitsTable);
            setHabits(rows);
            router.back();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader title="Edit Habit" subtitle={`Update ${habit.name}`} />

      <View style={styles.tags}>
        <InfoTag label="Unit" value={habit.unit || 'N/A'} />
        <InfoTag label="Goal" value={habit.goal.toString()} />
      </View>

      <FormField label="Name" value={name} onChangeText={setName} />
      <FormField label="Goal" value={goal} onChangeText={setGoal} />
      <FormField label="Unit" value={unit} onChangeText={setUnit} />

      <PrimaryButton label="Save Changes" onPress={saveChanges} />

      <View style={styles.buttonSpacing}>
        <PrimaryButton label="Delete" variant="danger" onPress={deleteHabit} />
      </View>

      <View style={styles.buttonSpacing}>
        <PrimaryButton label="Back" variant="secondary" onPress={() => router.back()} />
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
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 18,
  },
  buttonSpacing: {
    marginTop: 10,
  },
});