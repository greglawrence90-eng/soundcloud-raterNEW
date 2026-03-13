import fs from 'fs';
  import path from 'path';
  import { fileURLToPath } from 'url';

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const DB_FILE = path.join(__dirname, 'data.json');

  console.log('📁 Database file path:', DB_FILE);

  // Initialize DB file
  if (!fs.existsSync(DB_FILE)) {
    console.log('Creating new database file...');
    fs.writeFileSync(DB_FILE, JSON.stringify({ sets: [], ratings: [] }, null, 2));
    console.log('✓ Database file created');
  } else {
    console.log('✓ Database file exists');
  }

  const readDB = () => {
    const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    console.log('📖 Read DB:', data.sets.length, 'sets,', data.ratings.length, 'ratings');
    return data;
  };

  const writeDB = (data) => {
    console.log('💾 Writing DB:', data.sets.length, 'sets,', data.ratings.length, 'ratings');
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
    console.log('✓ DB written successfully');
  };

  const db = {
    prepare: (sql) => ({
      all: (...params) => {
        const data = readDB();

        if (sql.includes('FROM sets s LEFT JOIN ratings r')) {
          return data.sets.map(set => {
            const setRatings = data.ratings.filter(r => r.set_id === set.id);
            return {
              ...set,
              total_ratings: setRatings.length,
              avg_rating: setRatings.length ? setRatings.reduce((a, b) => a + b.rating, 0) / setRatings.length : null,
              listened_count: setRatings.filter(r => r.has_listened).length
            };
          });
        }

        if (sql.includes('FROM ratings WHERE set_id')) {
          const setId = params[0];
          return data.ratings.filter(r => r.set_id === setId);
        }

        if (sql.includes('FROM sets WHERE id')) {
          const id = params[0];
          return data.sets.filter(s => s.id === id);
        }

        return [];
      },
      get: (...params) => {
        const results = db.prepare(sql).all(...params);
        return results[0] || null;
      },
      run: (...params) => {
        console.log('🔧 Running SQL:', sql.substring(0, 50) + '...');
        const data = readDB();

        if (sql.includes('INSERT INTO sets')) {
          console.log('Adding new set:', params);
          const newSet = {
            id: data.sets.length > 0 ? Math.max(...data.sets.map(s => s.id)) + 1 : 1,
            soundcloud_url: params[0],
            title: params[1],
            posted_by: params[2],
            posted_at: new Date().toISOString()
          };
          data.sets.push(newSet);
          writeDB(data);
          console.log('✓ Set added, new ID:', newSet.id);
          return { lastInsertRowid: newSet.id };
        }

        if (sql.includes('INSERT INTO ratings')) {
          const [set_id, username, rating, has_listened] = params;
          const existingIdx = data.ratings.findIndex(r => r.set_id === set_id && r.username === username);

          if (existingIdx >= 0) {
            data.ratings[existingIdx] = {
              ...data.ratings[existingIdx],
              rating: params[4],
              has_listened: params[5],
              created_at: new Date().toISOString()
            };
          } else {
            data.ratings.push({
              id: data.ratings.length > 0 ? Math.max(...data.ratings.map(r => r.id)) + 1 : 1,
              set_id,
              username,
              rating,
              has_listened,
              created_at: new Date().toISOString()
            });
          }
          writeDB(data);
          return {};
        }

        if (sql.includes('UPDATE ratings')) {
          const [has_listened, setId, username] = params;
          const rating = data.ratings.find(r => r.set_id === parseInt(setId) && r.username === username);
          if (rating) {
            rating.has_listened = has_listened;
            writeDB(data);
          }
          return {};
        }

        return {};
      }
    })
  };

  export default db;
