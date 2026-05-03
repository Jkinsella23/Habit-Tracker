// Adapted from IS4447 lecture and tutorial examples
// Streak tracking - calculates consecutive days where habit goals are met
import { useContext, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HabitContext, Habit, HabitLog } from '../_layout';
import { useRouter } from 'expo-router';
import PrimaryButton from '@/components/ui/primary-button';
import ScreenHeader from '@/components/ui/screen-header';
import InfoTag from '@/components/ui/info-tag';
// https://claude.ai/share/103da780-302c-4b73-b2e9-f57cbd233666 AI used to create the streak, adapted code to include the timer warning to complete a habit before the streak is lost, Used the same chat to update the habit log table seed file to show the feature on initial load of application.
const getLocalDateStr = (date: Date = new Date()): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const calculateStreak = (habit: Habit, logs: HabitLog[]): number => {
  const metDates = logs
    .filter((log) => log.habitID === habit.id && log.value >= habit.goal)
    .map((log) => log.date)
    .filter((date, index, self) => self.indexOf(date) === index) // deduplicate
    .sort()
    .reverse();

  if (metDates.length < 2) return 0;

  const todayLocal = getLocalDateStr();
  const yest = new Date();
  yest.setDate(yest.getDate() - 1);
  const yesterdayLocal = getLocalDateStr(yest);

  if (metDates[0] !== todayLocal && metDates[0] !== yesterdayLocal) {
    return 0;
  }

  let streak = 1;
  for (let i = 1; i < metDates.length; i++) {
    const curr = new Date(metDates[i - 1] + 'T00:00:00');
    const prev = new Date(metDates[i] + 'T00:00:00');
    const diffDays = Math.round(
      (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diffDays === 1) {
      streak++;
    } else {
      break;
    }
  }
  return streak >= 2 ? streak : 0;
};

export default function HomeScreen() {
  const context = useContext(HabitContext);
  if (!context) return null;
  const { habits, user, logs } = context;
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Health', 'Fitness', 'Personal'];

  const todayStr = getLocalDateStr();
  const filteredHabits = habits.filter((habit: Habit) => {
    const matchesSearch =
      searchQuery.trim().length === 0 ||
      habit.name.toLowerCase().includes(searchQuery.trim().toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' ||
      habit.categoryID === categories.indexOf(selectedCategory);

    return matchesSearch && matchesCategory;
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader
        title={`Hi ${user?.name || 'there'}!`}
        subtitle={`${habits.length} habits tracked`}
      />

      <View style={styles.buttonRow}>
        <View style={{ flex: 1, marginRight: 5 }}>
          <PrimaryButton label="Add Habit" onPress={() => router.push('/habit/add')} />
        </View>
        <View style={{ flex: 1, marginLeft: 5 }}>
          <PrimaryButton label="Log Habit" variant="secondary" onPress={() => router.push('/habit/log')} />
        </View>
      </View>

      <TextInput
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search habits..."
        style={styles.searchInput}
      />

      <View style={styles.filterRow}>
        {categories.map((cat) => (
          <Pressable
            key={cat}
            onPress={() => setSelectedCategory(cat)}
            style={[styles.filterButton, selectedCategory === cat && styles.filterButtonSelected]}>
            <Text style={[styles.filterButtonText, selectedCategory === cat && styles.filterButtonTextSelected]}>
              {cat}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.listContent}>
        {filteredHabits.length === 0 ? (
          <View style={{ alignItems: 'center', paddingTop: 20 }}>
            <Text style={styles.emptyText}>No habits found.</Text>
            <Text style={{ color: '#6B7280', marginTop: 4 }}>Tap "Add Habit" to get started!</Text>
          </View>
        ) : (
          filteredHabits.map((habit: Habit) => {
            const streak = calculateStreak(habit, logs);
            const loggedToday = logs.some((l) => l.habitID === habit.id && l.date === todayStr && l.value >= habit.goal);

            let streakDisplay = '';
            if (streak >= 2 && loggedToday) {
              streakDisplay = `🔥 ${streak} days`;
            } else if (streak >= 2 && !loggedToday) {
              streakDisplay = `⏳ ${streak} days - log today!`;
            }

            return (
              <Pressable
                key={habit.id}
                onPress={() => router.push({ pathname: '/habit/[id]' as any, params: { id: habit.id.toString() } })}
                style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}>
                <Text style={styles.cardName}>
                  {habit.name} {streakDisplay}
                </Text>
                <View style={styles.tags}>
                  <InfoTag label="Goal" value={`${habit.goal} ${habit.unit || ''}`} />
                </View>
              </Pressable>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 18,
    paddingTop: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  searchInput: {
    backgroundColor: '#FFFFFF',
    borderColor: '#94A3B8',
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 4,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
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
  listContent: {
    paddingBottom: 24,
    paddingTop: 14,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 12,
    padding: 14,
  },
  cardPressed: {
    opacity: 0.5,
  },
  cardName: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '700',
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  emptyText: {
    color: '#475569',
    fontSize: 16,
    paddingTop: 8,
    textAlign: 'center',
  },
});