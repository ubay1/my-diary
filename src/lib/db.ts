
/* eslint-disable @typescript-eslint/no-unused-vars */
import initSqlJs, { type Database, type SqlJsStatic } from "sql.js";
import { set, get } from "idb-keyval";
import type { DiaryTypes } from "@/types/db";

let db: Database | null = null;
let SQL: SqlJsStatic | null = null;

export async function getDB(): Promise<Database> {
  if (db) return db;

  if (!SQL) {
    SQL = await initSqlJs({
      locateFile: (_file: string) => `/sql-wasm.wasm`,
    });
  }

  const saved = await get("diary-db");
  db = saved ? new SQL.Database(saved) : new SQL.Database();

  db.run(`
    CREATE TABLE IF NOT EXISTS diary (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      date TEXT,
      content TEXT,
      createdAt TEXT,
      updatedAt TEXT
    );
  `);

  db.run(`CREATE INDEX IF NOT EXISTS idx_diary_title ON diary(title);`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_diary_content ON diary(content);`);

  return db;
}

export async function saveDiary(title: initSqlJs.SqlValue, date: initSqlJs.SqlValue, content: initSqlJs.SqlValue) {
  const dbs = await getDB();
  if (!dbs) throw new Error("DB not initialized");;
  const now = new Date().toISOString();
  dbs.run(
    `INSERT INTO diary (title, date, content, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?)`,
    [title, date, content, now, now]
  );
}

export async function getDiary(date: string): Promise<Record<string, unknown> | null> {
  const dbs = await getDB();
  if (!dbs) throw new Error("DB not initialized");
  const stmt = dbs.prepare("SELECT * FROM diary WHERE date = ?");
  console.log('stmt = ', stmt.getAsObject())
  stmt.bind([date]);
  if (stmt.step()) return stmt.getAsObject();
  return null;
}

export async function getAllDiary() {
  const dbs = await getDB();
  if (!dbs) throw new Error("DB not initialized");
  const stmt = dbs.prepare("SELECT * FROM diary ORDER BY date DESC");
  const rows: DiaryTypes[] = [];
  while (stmt.step()) {
    rows.push(stmt.getAsObject() as unknown as DiaryTypes)
  }
  stmt.free();
  return rows;
}

export async function deleteDiary(id: number) {
  const db = await getDB();
  if (!db) throw new Error("DB not initialized");

  db.run("DELETE FROM diary WHERE id = ?", [id]);

  // Simpan perubahan ke IndexedDB biar persist offline
  const data = db.export();
  await set("diary-db", data);
}

export async function updateDiary(
  id: number,
  title: string,
  date: string,
  content: string
) {
  const db = await getDB();
  if (!db) throw new Error("DB not initialized");

  const now = new Date().toISOString();

  db.run(
    `UPDATE diary
     SET title = ?, date = ?, content = ?, updatedAt = ?
     WHERE id = ?`,
    [title, date, content, now, id]
  );

  // Simpan perubahan ke IndexedDB
  const data = db.export();
  await set("diary-db", data);
}

export async function getDiaryById(id: number) {
  const db = await getDB();
  if (!db) throw new Error("DB not initialized");

  const stmt = db.prepare("SELECT * FROM diary WHERE id = ?");
  stmt.bind([id]);
  if (stmt.step()) {
    return stmt.getAsObject();
  }
  return null;
}

export async function searchDiaryPrefix(keyword: string) {
  const db = await getDB();
  if (!db) throw new Error("DB not initialized");

  const stmt = db.prepare(
    `SELECT * FROM diary 
     WHERE title LIKE ? OR content LIKE ?
     ORDER BY date DESC
     LIMIT 50`
  );

  const pattern = `%${keyword}%` // pakai prefix
  stmt.bind([pattern, pattern]);

  const results: DiaryTypes[] = [];
  while (stmt.step()) {
    results.push(stmt.getAsObject() as unknown as DiaryTypes);
  }
  stmt.free();
  return results;
}



export async function persistDB() {
  const dbs = await getDB();
  if (!dbs) throw new Error("DB not initialized");
  const data = dbs.export();
  await set("diary-db", data);
}
