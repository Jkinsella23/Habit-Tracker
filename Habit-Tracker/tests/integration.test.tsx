// Integration test to confirm that habit list displays seeded data
// Adapted from the IS4447 Week 12 testing tutorial example
import { render, waitFor } from '@testing-library/react-native';
import React from 'react';
import IndexScreen from '../app/(tabs)/index';
import { HabitContext } from '../app/_layout';

jest.mock('@/db/client', () => ({
  db: {
    select: jest.fn(),
    insert: jest.fn(),
  },
}));

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn(), back: jest.fn() }),
}));

jest.mock('react-native-safe-area-context', () => {
  const { View } = require('react-native');
  return { SafeAreaView: View };
});

const mockHabit = {
  id: 1,
  name: 'Water',
  type: 'number',
  goal: 8,
  unit: 'glasses',
  categoryID: 1,
};

describe('IndexScreen', () => {
  it('renders the habit and the add button', async () => {
    const { getByText } = render(
      <HabitContext.Provider value={{
        habits: [mockHabit],
        setHabits: jest.fn(),
        logs: [],
        setLogs: jest.fn(),
        user: { id: 1, name: 'Jason', email: 'jason@test.com' },
        setUser: jest.fn(),
      }}>
        <IndexScreen />
      </HabitContext.Provider>
    );

    await waitFor(() => {
      expect(getByText('Water')).toBeTruthy();
      expect(getByText('Add Habit')).toBeTruthy();
    });
  });
});