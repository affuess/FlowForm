import * as SQLite from 'expo-sqlite';
import { UserProfile } from '../types/user';

export const userDbPromise = SQLite.openDatabaseAsync('users.db');

export const initUserDatabase = async (): Promise<void> => {
  const db = await userDbPromise;
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      firstName TEXT NOT NULL,
      lastName TEXT NOT NULL,
      birthDate TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT NOT NULL,
      city TEXT NOT NULL,
      password TEXT NOT NULL,
      gender TEXT NOT NULL,
      goal TEXT NOT NULL,
      agreedToTerms INTEGER NOT NULL,
      photoUri TEXT
    );
  `);
};

export const saveUser = async (user: UserProfile & { password: string }): Promise<number> => {
  const db = await userDbPromise;
  const result = await db.runAsync(
    `INSERT INTO users (firstName, lastName, birthDate, phone, email, city, password, gender, goal, agreedToTerms, photoUri)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    [
      user.firstName,
      user.lastName,
      user.birthDate,
      user.phone,
      user.email,
      user.city,
      user.password,
      user.gender,
      user.goal,
      user.agreedToTerms ? 1 : 0,
      user.photoUri || null,
    ]
  );
  return result.lastInsertRowId;
};

export const getLastUser = async (): Promise<UserProfile | null> => {
  const db = await userDbPromise;
  const row = await db.getFirstAsync<any>('SELECT * FROM users ORDER BY id DESC LIMIT 1;');
  if (!row) return null;

  return {
    ...row,
    agreedToTerms: Boolean(row.agreedToTerms),
  };
};