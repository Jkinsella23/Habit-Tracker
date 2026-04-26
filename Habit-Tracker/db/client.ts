import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';
const sqlite = openDatabaseSync('habits.db');
sqlite.execSync(`
CREATE TABLE IF NOT EXISTS habits (
id INTEGER PRIMARY KEY AUTOINCREMENT,
name TEXT NOT NULL,
type TEXT NOT NULL,
goal INTEGER NOT NULL,
unit TEXT
);
CREATE TABLE IF NOT EXISTS habitsLog (
id INTEGER PRIMARY KEY AUTOINCREMENT,
habitID INTEGER NOT NULL REFERENCES habits(id),
date TEXT NOT NULL,
value INTEGER NOT NULL,
);
`);
export const db = drizzle(sqlite);