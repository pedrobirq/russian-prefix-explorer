import "dotenv/config";
import express from "express";
import { createServer as createViteServer } from "vite";
import { getDb } from "./server/db.js";
import { seedDatabase } from "./server/seed.js";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

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

      const levels = levelsRes.rows.map(level => {
        const levelPrefixes = prefixesRes.rows
          .filter(p => p.level_id === level.id)
          .map(p => ({
            prefix: p.prefix,
            meaning: p.meaning,
            resultWord: p.result_word,
            resultMeaning: p.result_meaning,
            example: p.example
          }));
        
        return {
          id: level.id,
          baseVerb: level.base_verb,
          baseMeaning: level.base_meaning,
          prefixes: levelPrefixes
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
