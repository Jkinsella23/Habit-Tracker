Habit Tracker - IS4447

GitHub
https://github.com/Jkinsella23/Habit-Tracker

QR Codes

### Android
![Android QR Code](Habit-Tracker/assets/AndroidQR.png)

### iOS
![iOS QR Code](Habit-Tracker/assets/iOSQR.png)

Student
- Name: Jason Kinsella
- Student Number: 122318931
- Module: IS4447
- Habit Tracker Option A

Overview
A mobile habit tracking app built with React Native (Expo) and SQLite  Drizzle ORM. Users can create habits, log daily activity, set weekly targets, and view progress through charts and streak tracking.

Setup
1. cd Habit-Tracker
2. npm install
4. npx expo start

Testing
npm test

Three tests included:
- Unit test: Seed function inserts data correctly without duplication
- Component test: FormField renders label and fires onChangeText
- Integration test: Habit list displays seeded data after database 

Tables
- categories 
- habits 
- habit_logs 
- targets 
- users 

Folder Structure
app/
  (tabs)/ - Home, Stats, Settings screens
  habit/ - Add, log, edit/delete habit screens
  login.tsx - Login screen
  register.tsx - Register screen
  categories.tsx - Category management
  _layout.tsx - Root layout with context
components/
  ui/ - FormField, PrimaryButton, ScreenHeader, InfoTag
db/
  schema.ts - Drizzle table definitions
  client.ts - Database connection
  seed.ts - Sample data
tests/
  unit.test.ts
  component.test.tsx
  integration.test.tsx


