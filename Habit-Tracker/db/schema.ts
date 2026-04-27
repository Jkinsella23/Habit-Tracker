import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const categoriesTable = sqliteTable('categories',{
id: integer('id').primaryKey({ autoIncrement: true }),
name: text('name').notNull(),
colour: text('colour').notNull(),
icon: text('icon').notNull(),
});

export const habitsTable = sqliteTable('habits', {
id: integer('id').primaryKey({ autoIncrement: true }),
categoryID: integer('categoryID').notNull().references(() => categoriesTable.id),
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
notes: text('notes'),
});

export const targetTable = sqliteTable('targets', {
id: integer('id').primaryKey({ autoIncrement: true }),
habitID: integer('habitID').notNull().references(() => habitsTable.id),
type: text('type').notNull(),
goal: integer('goal').notNull(),
});

export const userTable = sqliteTable('users', {
id: integer('id').primaryKey({ autoIncrement: true }),
name: text('name').notNull(),
email: text('email').notNull(),
password: text('password').notNull(),
});