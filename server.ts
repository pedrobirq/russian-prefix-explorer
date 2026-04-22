import "dotenv/config";
import express from "express";
import { createServer as createViteServer } from "vite";
import { getDb } from "./server/db.js";
import { seedDatabase } from "./server/seed.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-jwt-key";

// Middleware to authenticate
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Auth Routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) return res.status(400).json({ error: "Username and password required" });
      
      const db = getDb();
      await seedDatabase();

      const existingUser = await db.query('SELECT id FROM users WHERE username = $1', [username]);
      if (existingUser.rows.length > 0) return res.status(400).json({ error: "Username already exists" });

      const hash = await bcrypt.hash(password, 10);
      const userRes = await db.query(
        'INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id',
        [username, hash]
      );
      
      const token = jwt.sign({ id: userRes.rows[0].id, username }, JWT_SECRET);
      res.json({ token, username });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      const db = getDb();
      
      const userRes = await db.query('SELECT * FROM users WHERE username = $1', [username]);
      if (userRes.rows.length === 0) return res.status(400).json({ error: "User not found" });

      const user = userRes.rows[0];
      const match = await bcrypt.compare(password, user.password_hash);
      
      if (!match) return res.status(401).json({ error: "Invalid password" });

      const token = jwt.sign({ id: user.id, username }, JWT_SECRET);
      res.json({ token, username });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Progress Routes
  app.get("/api/progress", authenticateToken, async (req: any, res: any) => {
    try {
      const db = getDb();
      const progressRes = await db.query('SELECT * FROM user_progress WHERE user_id = $1', [req.user.id]);
      res.json(progressRes.rows);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/progress/:levelId", authenticateToken, async (req: any, res: any) => {
    try {
      const { levelId } = req.params;
      const { foundWords, completedWordExercises, levelCompleted } = req.body;
      const db = getDb();

      await db.query(`
        INSERT INTO user_progress (user_id, level_id, found_words, completed_word_exercises, level_completed)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (user_id, level_id) 
        DO UPDATE SET 
          found_words = EXCLUDED.found_words,
          completed_word_exercises = EXCLUDED.completed_word_exercises,
          level_completed = EXCLUDED.level_completed
      `, [req.user.id, levelId, JSON.stringify(foundWords), JSON.stringify(completedWordExercises), levelCompleted]);

      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/api/levels", async (req, res) => {
    try {
      const db = getDb();
      // Ensure DB is seeded
      await seedDatabase();

      const levelsRes = await db.query('SELECT * FROM levels ORDER BY id ASC');
      const prefixesRes = await db.query('SELECT * FROM prefixes');
      const exercisesRes = await db.query('SELECT * FROM exercises');

      const levels = levelsRes.rows.map(level => {
        const levelPrefixes = prefixesRes.rows
          .filter(p => p.level_id === level.id)
          .map(p => {
            const prefixExercises = exercisesRes.rows
              .filter(e => e.prefix_id === p.id)
              .map(e => ({
                id: e.id,
                sentence: e.sentence,
                correctAnswer: e.correct_answer,
                options: e.options
              }));

            return {
              id: p.id,
              prefix: p.prefix,
              baseForm: p.base_form || level.base_verb,
              resultWord: p.result_word,
              resultMeaning: p.result_meaning,
              example: p.example,
              exercises: prefixExercises
            };
          });
        
        const levelExercises = exercisesRes.rows
          .filter(e => e.level_id === level.id && e.prefix_id === null)
          .map(e => ({
            id: e.id,
            sentence: e.sentence,
            correctAnswer: e.correct_answer,
            options: e.options
          }));

        return {
          id: level.id,
          baseVerb: level.base_verb,
          baseMeaning: level.base_meaning,
          prefixes: levelPrefixes,
          levelExercises: levelExercises
        };
      });

      res.json(levels);
    } catch (error: any) {
      console.error('Database error:', error);
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
