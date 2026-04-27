import { db } from './client';
import { categoriesTable, habitsTable, habitLogsTable, targetTable } from './schema';

export async function seedIfEmpty() {
  const existing = await db.select().from(categoriesTable);
  if (existing.length > 0) return;

  // Seed categories
  await db.insert(categoriesTable).values([
    { name: 'Health', colour: '#4CAF50', icon: 'heart' },
    { name: 'Fitness', colour: '#2196F3', icon: 'dumbbell' },
    { name: 'Personal', colour: '#9C27B0', icon: 'book' },
  ]);

  // Seed habits
  await db.insert(habitsTable).values([
    { name: 'Water', type: 'number', goal: 8, unit: 'glasses', categoryID: 1 },
    { name: 'Sleep', type: 'number', goal: 8, unit: 'hours', categoryID: 1 },
    { name: 'Steps', type: 'number', goal: 10000, unit: 'steps', categoryID: 2 },
    { name: 'Gym', type: 'checkbox', goal: 1, unit: null, categoryID: 2 },
    { name: 'Reading', type: 'checkbox', goal: 1, unit: null, categoryID: 3 },
  ]);

  // Seed some sample logs
  await db.insert(habitLogsTable).values([
    { habitID: 1, date: '2026-04-20', value: 6, notes: null },
    { habitID: 1, date: '2026-04-21', value: 8, notes: 'Hit my goal!' },
    { habitID: 2, date: '2026-04-20', value: 7, notes: 'Tired today' },
    { habitID: 2, date: '2026-04-21', value: 8, notes: null },
    { habitID: 3, date: '2026-04-20', value: 8500, notes: null },
    { habitID: 3, date: '2026-04-21', value: 12000, notes: 'Went for a long walk' },
    { habitID: 4, date: '2026-04-20', value: 1, notes: null },
    { habitID: 4, date: '2026-04-21', value: 0, notes: 'Rest day' },
    { habitID: 5, date: '2026-04-20', value: 1, notes: 'Read 30 pages' },
    { habitID: 5, date: '2026-04-21', value: 1, notes: null },
  ]);

  // Seed targets
  await db.insert(targetTable).values([
    { habitID: 1, type: 'weekly', goal: 56 },
    { habitID: 2, type: 'weekly', goal: 49 },
    { habitID: 3, type: 'weekly', goal: 70000 },
    { habitID: 4, type: 'weekly', goal: 5 },
    { habitID: 5, type: 'monthly', goal: 20 },
  ]);
}