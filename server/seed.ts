import { getDb } from './db.js';
import { levels } from '../src/data/levels.js';

let isSeeded = false;

export async function seedDatabase() {
  if (isSeeded) return;
  
  const db = getDb();
  
  // Create tables
  await db.query(`
    CREATE TABLE IF NOT EXISTS levels (
      id SERIAL PRIMARY KEY,
      base_verb VARCHAR(255) NOT NULL,
      base_meaning VARCHAR(255) NOT NULL
    );
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS prefixes (
      id SERIAL PRIMARY KEY,
      level_id INTEGER REFERENCES levels(id) ON DELETE CASCADE,
      prefix VARCHAR(50) NOT NULL,
      meaning VARCHAR(255) NOT NULL,
      result_word VARCHAR(255) NOT NULL,
      result_meaning VARCHAR(255) NOT NULL,
      example TEXT NOT NULL
    );
  `);

  // Check if data exists
  const res = await db.query('SELECT COUNT(*) FROM levels');
  if (parseInt(res.rows[0].count) === 0) {
    console.log('Seeding database...');
    for (const level of levels) {
      const levelRes = await db.query(
        'INSERT INTO levels (base_verb, base_meaning) VALUES ($1, $2) RETURNING id',
        [level.baseVerb, level.baseMeaning]
      );
      const levelId = levelRes.rows[0].id;

      for (const prefix of level.prefixes) {
        await db.query(
          `INSERT INTO prefixes 
          (level_id, prefix, meaning, result_word, result_meaning, example) 
          VALUES ($1, $2, $3, $4, $5, $6)`,
          [levelId, prefix.prefix, prefix.meaning, prefix.resultWord, prefix.resultMeaning, prefix.example]
        );
      }
    }
    console.log('Database seeded successfully.');
  }
  isSeeded = true;
}
