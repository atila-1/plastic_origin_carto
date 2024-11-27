import { IDBPDatabase, openDB } from 'idb';

const DB_NAME = 'TrashDB';
const STORE_NAME = 'trashData';

export const initDB = async (): Promise<IDBPDatabase> => {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    },
  });
};

export const setItem = async <T>(key: string, value: T): Promise<void> => {
  const db = await initDB();
  await db.put(STORE_NAME, value, key);
};

export const getItem = async <T>(key: string): Promise<T> => {
  const db = await initDB();
  return db.get(STORE_NAME, key);
};