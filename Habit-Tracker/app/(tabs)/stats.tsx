// Adapted from IS4447 lecture and tutorial examples
import { useContext, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BarChart } from 'react-native-gifted-charts';
import { HabitContext, Habit } from '../_layout';
import ScreenHeader from '@/components/ui/screen-header';
import InfoTag from '@/components/ui/info-tag';

export default function StatsScreen() {
  const context = useContext(HabitContext);
  if (!context) return null;
  const { habits, logs } = context;

  const [period, setPeriod] = useState('week');
  const periods = ['day', 'week', 'month'];

  const today = new Date();

  const getDateRange = () => {
    const end = today.toISOString().slice(0, 10);

    if (period === 'day') {
      return { start: end, end };
    }

    if (period === 'week') {
      const start = new Date(today);
      start.setDate(today.getDate() - 7);
      return { start: start.toISOString().slice(0, 10), end };
    }

    const start = new Date(today);
    start.setDate(today.getDate() - 30);
    return { start: start.toISOString().slice(0, 10), end };
  };

  const { start, end } = getDateRange();

  const filteredLogs = logs.filter(
    (log) => log.date >= start && log.date <= end
  );

  const totalLogs = filteredLogs.length;

  const habitsLogged = new Set(filteredLogs.map((l) => l.habitID)).size;

  const chartData = habits.map((habit: Habit) => {
    const habitLogs = filteredLogs.filter((l) => l.habitID === habit.id);
    const total = habitLogs.reduce((sum, l) => sum + l.value, 0);

    return {
      value: total,
      label: habit.name.slice(0, 6),
      frontColor: '#0F766E',
    };
  });

  const goalData = habits.map((habit: Habit) => {
    const habitLogs = filteredLogs.filter((l) => l.habitID === habit.id);
    const total = habitLogs.reduce((sum, l) => sum + l.value, 0);

    let multiplier = 1;
    if (period === 'week') multiplier = 7;
    if (period === 'month') multiplier = 30;

    const target = habit.goal * multiplier;
    const percentage = target > 0 ? Math.round((total / target) * 100) : 0;

    return {
      name: habit.name,
      current: total,
      target,
      percentage: Math.min(percentage, 100),
      status: total >= target ? 'met' : 'unmet',
    };
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenHeader
          title="Stats"
          subtitle={`${start} to ${end}`}
        />

        <View style={styles.filterRow}>
          {periods.map((p) => (
            <Pressable
              key={p}
              onPress={() => setPeriod(p)}
              style={[styles.filterButton, period === p && styles.filterButtonSelected]}>
              <Text style={[styles.filterButtonText, period === p && styles.filterButtonTextSelected]}>
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.summaryRow}>
          <InfoTag label="Logs" value={totalLogs.toString()} />
          <InfoTag label="Habits" value={habitsLogged.toString()} />
        </View>

        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Activity by Habit</Text>
          {chartData.length > 0 ? (
            <BarChart
              key={`${period}-${logs.length}`}
              data={chartData}
              barWidth={30}
              spacing={20}
              noOfSections={5}
              barBorderRadius={6}
              yAxisThickness={0}
              xAxisThickness={0}
              isAnimated
            />
          ) : (
            <Text style={styles.emptyText}>No data to show</Text>
          )}
        </View>

        <Text style={styles.sectionTitle}>Goal Progress</Text>

        {goalData.map((item) => (
          <View key={item.name} style={styles.goalCard}>
            <View style={styles.goalHeader}>
              <Text style={styles.goalName}>{item.name}</Text>
              <InfoTag
                label="Status"
                value={item.status === 'met' ? ' Complete' : ' Incomplete'}
              />
            </View>
            <Text style={styles.goalText}>
              {item.current} / {item.target} ({item.percentage}%)
            </Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${item.percentage}%` }]} />
            </View>
          </View>
        ))}
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
    padding: 18,
    paddingBottom: 40,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  filterButton: {
    backgroundColor: '#FFFFFF',
    borderColor: '#94A3B8',
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 16,
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
  summaryRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
  },
  chartTitle: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  goalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  goalName: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '600',
  },
  goalText: {
    color: '#6B7280',
    fontSize: 14,
    marginBottom: 8,
  },
  progressBar: {
    backgroundColor: '#E5E7EB',
    borderRadius: 999,
    height: 8,
  },
  progressFill: {
    backgroundColor: '#0F766E',
    borderRadius: 999,
    height: 8,
  },
  emptyText: {
    color: '#475569',
    fontSize: 16,
    textAlign: 'center',
    paddingVertical: 20,
  },
});