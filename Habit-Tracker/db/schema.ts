import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const habitsTable = sqliteTable('habits', {
id: integer('id').primaryKey({ autoIncrement: true }),
name: text('name').notNull(),
type: text('type').notNull(),
goal: integer('goal').notNull(),
unit: text('unit'),
});

export const habitLogsTable = sqliteTable('habitsLog', {
id: integer('id').primaryKey({ autoIncrement: true }),
habitID: integer('habitID').notNull().references(() => habitsTable.id),
date: text('date').notNull(),
value: integer('value').notNull(),
});