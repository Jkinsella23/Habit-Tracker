import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';

const sqlite = openDatabaseSync('habits.db');

sqlite.execSync(`
CREATE TABLE IF NOT EXISTS categories (
id INTEGER PRIMARY KEY AUTOINCREMENT,
name TEXT NOT NULL,
colour TEXT NOT NULL,
icon TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS habits (
id INTEGER PRIMARY KEY AUTOINCREMENT,
categoryID INTEGER NOT NULL REFERENCES categories(id),
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
notes TEXT
);
CREATE TABLE IF NOT EXISTS targets (
id INTEGER PRIMARY KEY AUTOINCREMENT,
habitID INTEGER NOT NULL REFERENCES habits(id),
type TEXT NOT NULL,
goal INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS users (
id INTEGER PRIMARY KEY AUTOINCREMENT,
name TEXT NOT NULL,
email TEXT NOT NULL,
password TEXT NOT NULL
);
`);

export const db = drizzle(sqlite);