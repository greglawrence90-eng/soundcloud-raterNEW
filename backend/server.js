  import express from 'express';
  import cors from 'cors';
  import path from 'path';
  import { fileURLToPath } from 'url';
  import db from './db.js';

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const app = express();
  const PORT = process.env.PORT || 8080;

  app.use(cors());
  app.use(express.json());

  // Test endpoint
  app.get('/api/test', (req, res) => {
    console.log('🧪 TEST endpoint called');
    res.json({ status: 'working', timestamp: new Date().toISOString() });
  });

  // Get all sets with their ratings and sentiment
  app.get('/api/sets', (req, res) => {
    try {
      console.log('📡 GET /api/sets called');
      const sets = db.prepare(`
        SELECT
          s.*,
          COUNT(DISTINCT r.id) as total_ratings,
          AVG(r.rating) as avg_rating,
          SUM(CASE WHEN r.has_listened = 1 THEN 1 ELSE 0 END) as listened_count
        FROM sets s
        LEFT JOIN ratings r ON s.id = r.set_id
        GROUP BY s.id
        ORDER BY s.posted_at DESC
      `).all();

      console.log('📊 Raw query result:', sets);

      const setsWithRatings = sets.map(set => {
        const ratings = db.prepare(`
          SELECT username, rating, has_listened, created_at
          FROM ratings
          WHERE set_id = ?
          ORDER BY created_at DESC
        `).all(set.id);

        return {
          ...set,
          ratings,
          avg_rating: set.avg_rating ? parseFloat(set.avg_rating.toFixed(2)) : null
        };
      });

      console.log('✅ Sending response with', setsWithRatings.length, 'sets');
      res.json(setsWithRatings);
    } catch (error) {
      console.error('❌ Error in GET /api/sets:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Add a new set
  app.post('/api/sets', (req, res) => {
    try {
      const { soundcloud_url, title, posted_by } = req.body;

      if (!soundcloud_url || !title || !posted_by) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const result = db.prepare(`
        INSERT INTO sets (soundcloud_url, title, posted_by)
        VALUES (?, ?, ?)
      `).run(soundcloud_url, title, posted_by);

      const newSet = db.prepare('SELECT * FROM sets WHERE id = ?').get(result.lastInsertRowid);
      res.status(201).json(newSet);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Delete a set
  app.delete('/api/sets/:id', (req, res) => {
    try {
      const { id } = req.params;
      console.log('🗑️  Deleting set ID:', id);

      db.prepare(`DELETE FROM sets WHERE id = ?`).run(parseInt(id));

      res.json({ message: 'Set deleted successfully' });
    } catch (error) {
      console.error('❌ Error deleting set:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Add or update a rating
  app.post('/api/ratings', (req, res) => {
    try {
      const { set_id, username, rating, has_listened } = req.body;

      if (!set_id || !username || rating === undefined) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      if (rating < 1 || rating > 5) {
        return res.status(400).json({ error: 'Rating must be between 1 and 5' });
      }

      db.prepare(`
        INSERT INTO ratings (set_id, username, rating, has_listened)
        VALUES (?, ?, ?, ?)
        ON CONFLICT(set_id, username)
        DO UPDATE SET rating = ?, has_listened = ?, created_at = CURRENT_TIMESTAMP
      `).run(set_id, username, rating, has_listened ? 1 : 0, rating, has_listened ? 1 : 0);

      res.status(201).json({ message: 'Rating saved' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Toggle "has listened" status
  app.patch('/api/ratings/:setId/:username/listened', (req, res) => {
    try {
      const { setId, username } = req.params;
      const { has_listened } = req.body;

      db.prepare(`
        UPDATE ratings
        SET has_listened = ?
        WHERE set_id = ? AND username = ?
      `).run(has_listened ? 1 : 0, setId, username);

      res.json({ message: 'Listened status updated' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Serve static files from React build
  app.use(express.static(path.join(__dirname, '../frontend/dist')));

  // Serve React app for all other routes
  app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🎵 SoundCloud Rater running on port ${PORT}`);
  });
