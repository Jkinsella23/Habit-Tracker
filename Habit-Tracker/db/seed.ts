import { db } from './client';
import { habitsTable } from './schema';

export async function seedHabitsIfEmpty() {
  const existing = await db.select().from(habitsTable);
  if (existing.length > 0) return;

  await db.insert(habitsTable).values([
    { name: 'Steps', type: 'number', goal: 10000, unit: 'steps' },
    { name: 'Water', type: 'number', goal: 8, unit: 'glasses' },
    { name: 'Sleep', type: 'number', goal: 8, unit: 'hours' },
    { name: 'Reading', type: 'checkbox', goal: 1, unit: null },
    { name: 'Gym', type: 'checkbox', goal: 1, unit: null },
  ]);
}