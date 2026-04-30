// Adapted from IS4447 lecture and tutorial examples
import { useContext, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HabitContext, Habit } from '../_layout';
import { useRouter } from 'expo-router';
import PrimaryButton from '@/components/ui/primary-button';
import ScreenHeader from '@/components/ui/screen-header';
import InfoTag from '@/components/ui/info-tag';

export default function HomeScreen() {
  const context = useContext(HabitContext);
  if (!context) return null;
  const { habits, user } = context;
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Health', 'Fitness', 'Personal'];

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
          <Text style={styles.emptyText}>No habits found.</Text>
        ) : (
          filteredHabits.map((habit: Habit) => (
            <Pressable
              key={habit.id}
              onPress={() => router.push({ pathname: '/habit/[id]' as any, params: { id: habit.id.toString() } })}
              style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}>
              <Text style={styles.cardName}>{habit.name}</Text>
              <View style={styles.tags}>
                <InfoTag label="Goal" value={`${habit.goal} ${habit.unit || ''}`} />
              </View>
            </Pressable>
          ))
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