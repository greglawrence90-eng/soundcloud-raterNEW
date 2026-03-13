import Database from 'better-sqlite3';

const db = new Database('soundcloud-rater.db');

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

export default db;
