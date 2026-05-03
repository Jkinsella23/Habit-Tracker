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

await db.insert(habitLogsTable).values([
  // --- Habit 1: Water (goal: 8 glasses) ---
  // Active 5-day streak (May 3 back to Apr 29) → shows 🔥 5 day streak
  { habitID: 1, date: '2026-04-29', value: 9, notes: 'Great hydration day' },
  { habitID: 1, date: '2026-04-30', value: 8, notes: null },
  { habitID: 1, date: '2026-05-01', value: 10, notes: 'Exceeded goal!' },
  { habitID: 1, date: '2026-05-02', value: 8, notes: null },
  { habitID: 1, date: '2026-05-03', value: 8, notes: 'Hit my goal!' },

  // --- Habit 2: Sleep (goal: 8 hours) ---
  // Last goal met was yesterday (May 2), streak of 3 → shows ⏳ about to lose
  { habitID: 2, date: '2026-04-30', value: 8, notes: null },
  { habitID: 2, date: '2026-05-01', value: 9, notes: 'Slept great' },
  { habitID: 2, date: '2026-05-02', value: 8, notes: null },
  // No log for May 3 → timer warning

  // --- Habit 3: Steps (goal: 10000 steps) ---
  // Active 3-day streak → shows 🔥 3 day streak
  { habitID: 3, date: '2026-04-28', value: 8500, notes: 'Missed goal' },
  { habitID: 3, date: '2026-05-01', value: 11000, notes: null },
  { habitID: 3, date: '2026-05-02', value: 10500, notes: 'Nice walk' },
  { habitID: 3, date: '2026-05-03', value: 12000, notes: 'Went for a long walk' },

  // --- Habit 4: Gym (goal: 1 checkbox) ---
  // Last met yesterday, streak of 2 → shows ⏳ about to lose
  { habitID: 4, date: '2026-05-01', value: 1, notes: null },
  { habitID: 4, date: '2026-05-02', value: 1, notes: 'Leg day' },
  // No log for May 3 → timer warning

  // --- Habit 5: Reading (goal: 1 checkbox) ---
  // Streak broken — last met Apr 30, missed May 1 → no badge at all
  { habitID: 5, date: '2026-04-29', value: 1, notes: 'Read 30 pages' },
  { habitID: 5, date: '2026-04-30', value: 1, notes: null },
  // Gap on May 1 breaks it, no active streak
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