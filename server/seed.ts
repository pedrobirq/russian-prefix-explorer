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
      result_word VARCHAR(255) NOT NULL,
      result_meaning VARCHAR(255) NOT NULL,
      example TEXT NOT NULL
    );
  `);

  // Drop meaning column if it exists
  await db.query(`
    ALTER TABLE prefixes 
    DROP COLUMN IF EXISTS meaning;
  `);

  // Add base_form column if it doesn't exist (for existing DBs)
  await db.query(`
    ALTER TABLE prefixes 
    ADD COLUMN IF NOT EXISTS base_form VARCHAR(255);
  `);

  // Backfill base_form for existing rows
  await db.query(`
    UPDATE prefixes 
    SET base_form = (SELECT base_verb FROM levels WHERE levels.id = prefixes.level_id) 
    WHERE base_form IS NULL OR base_form = '';
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS exercises (
      id SERIAL PRIMARY KEY,
      level_id INTEGER REFERENCES levels(id) ON DELETE CASCADE,
      prefix_id INTEGER REFERENCES prefixes(id) ON DELETE CASCADE,
      sentence TEXT NOT NULL,
      correct_answer VARCHAR(255) NOT NULL,
      options JSONB NOT NULL
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
          (level_id, prefix, base_form, result_word, result_meaning, example) 
          VALUES ($1, $2, $3, $4, $5, $6)`,
          [levelId, prefix.prefix, prefix.baseForm, prefix.resultWord, prefix.resultMeaning, prefix.example]
        );
      }
    }
    console.log('Database seeded successfully.');
  }

  // Seed exercises if empty
  const exRes = await db.query('SELECT COUNT(*) FROM exercises');
  if (parseInt(exRes.rows[0].count) === 0) {
    console.log('Seeding auto-generated test exercises...');
    const allPrefixes = await db.query('SELECT * FROM prefixes');
    const allLevels = await db.query('SELECT * FROM levels');

    for (const prefix of allPrefixes.rows) {
      // Generate 5 Type 1 exercises per prefix
      for (let i = 1; i <= 5; i++) {
        const options = JSON.stringify([
          prefix.result_word,
          prefix.result_word + 'л', // dummy wrong option
          'не' + prefix.result_word // dummy wrong option
        ].sort(() => Math.random() - 0.5));

        await db.query(
          `INSERT INTO exercises (level_id, prefix_id, sentence, correct_answer, options)
           VALUES ($1, $2, $3, $4, $5)`,
          [prefix.level_id, prefix.id, `Тестовое предложение ${i} для слова: ___`, prefix.result_word, options]
        );
      }
    }

    for (const level of allLevels.rows) {
      // Generate 20 Type 2 exercises per level
      const levelPrefixes = allPrefixes.rows.filter(p => p.level_id === level.id);
      if (levelPrefixes.length === 0) continue;

      for (let i = 1; i <= 20; i++) {
        const correctPrefix = levelPrefixes[Math.floor(Math.random() * levelPrefixes.length)];
        // Get 3 random options including the correct one
        const optionsArray = levelPrefixes.map(p => p.result_word).sort(() => Math.random() - 0.5).slice(0, 3);
        if (!optionsArray.includes(correctPrefix.result_word)) {
          optionsArray[0] = correctPrefix.result_word;
        }
        const options = JSON.stringify(optionsArray.sort(() => Math.random() - 0.5));

        await db.query(
          `INSERT INTO exercises (level_id, prefix_id, sentence, correct_answer, options)
           VALUES ($1, $2, $3, $4, $5)`,
          [level.id, null, `Финальный тест ${i} уровня ${level.id}. Вставьте слово: ___`, correctPrefix.result_word, options]
        );
      }
    }
    console.log('Exercises seeded successfully.');
  }

  // Create Users and Progress tables
  await db.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL
    );
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS user_progress (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      level_id INTEGER REFERENCES levels(id) ON DELETE CASCADE,
      found_words JSONB DEFAULT '[]'::jsonb,
      completed_word_exercises JSONB DEFAULT '[]'::jsonb,
      level_completed BOOLEAN DEFAULT false,
      UNIQUE(user_id, level_id)
    );
  `);

  isSeeded = true;
}
