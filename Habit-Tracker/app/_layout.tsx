import { Stack } from 'expo-router';
import { createContext, useEffect, useState } from 'react';
import { db } from '@/db/client';
import { habitsTable } from '@/db/schema';
import { seedHabitsIfEmpty } from '@/db/seed';

// Adapted from IS4447 student _layout.tsx example - modified for habits with SQLite

export type Habit = {
  id: number;
  name: string;
  type: string;
  goal: number;
  unit: string | null;
};

type HabitContextType = {
  habits: Habit[];
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>;
};

export const HabitContext = createContext<HabitContextType | null>(null);

export default function RootLayout() {
  const [habits, setHabits] = useState<Habit[]>([]);

  useEffect(() => {
    async function loadHabits() {
      await seedHabitsIfEmpty();
      const rows = await db.select().from(habitsTable);
      setHabits(rows);
    }
    loadHabits();
  }, []);

  return (
    <HabitContext.Provider value={{ habits, setHabits }}>
      <Stack />
    </HabitContext.Provider>
  );
}