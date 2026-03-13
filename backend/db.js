 import Database from 'better-sqlite3';
  import path from 'path';
  import { fileURLToPath } from 'url';

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  // Use /tmp for database in Railway (ephemeral but writable)
  // In production with volume mounted, this should be /data
  const dbPath = process.env.DATABASE_PATH || path.join(__dirname, 'soundcloud-rater.db');

  console.log('📁 Database path:', dbPath);

  const db = new Database(dbPath);

  // Initialize database tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS sets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      soundcloud_url TEXT NOT NULL,
      title TEXT NOT NULL,
      posted_by TEXT NOT NULL,
      posted_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS ratings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      set_id INTEGER NOT NULL,
      username TEXT NOT NULL,
      rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
      has_listened BOOLEAN NOT NULL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (set_id) REFERENCES sets(id) ON DELETE CASCADE,
      UNIQUE(set_id, username)
    );
  `);
