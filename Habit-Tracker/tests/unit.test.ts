// Unit test: verify seed function inserts data correctly
// Adapted from IS4447 Week 12 testing tutorial
import { db } from '../db/client';
import { seedIfEmpty } from '../db/seed';

jest.mock('../db/client', () => ({
  db: {
    select: jest.fn(),
    insert: jest.fn(),
  },
}));

const mockDb = db as unknown as { select: jest.Mock; insert: jest.Mock };

describe('seedIfEmpty', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('inserts data when tables are empty', async () => {
    const mockValues = jest.fn().mockResolvedValue(undefined);
    const mockFrom = jest.fn().mockResolvedValue([]);
    mockDb.select.mockReturnValue({ from: mockFrom });
    mockDb.insert.mockReturnValue({ values: mockValues });

    await seedIfEmpty();

    expect(mockDb.insert).toHaveBeenCalled();
    expect(mockValues).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ name: 'Health' }),
        expect.objectContaining({ name: 'Fitness' }),
        expect.objectContaining({ name: 'Personal' }),
      ])
    );
  });

  it('does not insert when data already exists', async () => {
    const mockFrom = jest.fn().mockResolvedValue([
      { id: 1, name: 'Health', colour: '#4CAF50', icon: 'heart' },
    ]);
    mockDb.select.mockReturnValue({ from: mockFrom });

    await seedIfEmpty();

    expect(mockDb.insert).not.toHaveBeenCalled();
  });
});