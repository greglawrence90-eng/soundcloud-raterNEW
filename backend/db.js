// In-memory database (persists during session, resets on redeploy)
  let data = { sets: [], ratings: [] };

  console.log('📁 Using in-memory database');

  const db = {
    prepare: (sql) => ({
      all: (...params) => {
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
          return data.ratings.filter(r => r.set_id === params[0]);
        }

        if (sql.includes('FROM sets WHERE id')) {
          return data.sets.filter(s => s.id === params[0]);
        }

        return [];
      },
      get: (...params) => {
        const results = db.prepare(sql).all(...params);
        return results[0] || null;
      },
      run: (...params) => {
        if (sql.includes('INSERT INTO sets')) {
          const newSet = {
            id: data.sets.length > 0 ? Math.max(...data.sets.map(s => s.id)) + 1 : 1,
            soundcloud_url: params[0],
            title: params[1],
            posted_by: params[2],
            posted_at: new Date().toISOString()
          };
          data.sets.push(newSet);
          console.log('✓ Set added:', newSet.title, '- Total sets:', data.sets.length);
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
          console.log('✓ Rating added - Total ratings:', data.ratings.length);
          return {};
        }

        if (sql.includes('UPDATE ratings')) {
          const [has_listened, setId, username] = params;
          const rating = data.ratings.find(r => r.set_id === parseInt(setId) && r.username === username);
          if (rating) {
            rating.has_listened = has_listened;
          }
          return {};
        }

        return {};
      }
    })
  };

  export default db;
