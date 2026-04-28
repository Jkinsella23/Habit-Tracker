import { Stack } from 'expo-router';
import { createContext, useEffect, useState } from 'react';
import { db } from '@/db/client';
import { habitsTable } from '@/db/schema';
import { seedIfEmpty } from '@/db/seed';
// Adapted from IS4447 student _layout.tsx example - modified for habits with SQLite

export type Habit = {
  id: number;
  name: string;
  type: string;
  goal: number;
  unit: string | null;
  categoryID: number;
};

export type User = {
  id: number;
  name: string;
  email: string;
};

type HabitContextType = {
  habits: Habit[];
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>;
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

export const HabitContext = createContext<HabitContextType | null>(null);

export default function RootLayout() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function loadData() {
      await seedIfEmpty();
      const rows = await db.select().from(habitsTable);
      setHabits(rows);
    }
    loadData();
  }, []);

  return (
    <HabitContext.Provider value={{ habits, setHabits, user, setUser }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </HabitContext.Provider>
  );
}