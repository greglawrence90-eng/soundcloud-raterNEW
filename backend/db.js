  // In-memory database
  const data = { sets: [], ratings: [] };

  console.log('📁 Using in-memory database');

  const db = {
    prepare: (sql) => ({
      all: (...params) => {
        // Normalize SQL for matching (remove extra whitespace)
        const normalizedSql = sql.replace(/\s+/g, ' ').trim();
        console.log('🔍 Normalized query:', normalizedSql.substring(0, 60) + '...');
        console.log('💾 Current data.sets:', data.sets.length, 'items');

        if (normalizedSql.includes('FROM sets s') || normalizedSql.includes('LEFT JOIN ratings')) {
          const result = data.sets.map(set => {
            const setRatings = data.ratings.filter(r => r.set_id === set.id);
            return {
              ...set,
              total_ratings: setRatings.length,
              avg_rating: setRatings.length ? setRatings.reduce((a, b) => a + b.rating, 0) / setRatings.length : null,
              listened_count: setRatings.filter(r => r.has_listened).length
            };
          });
          console.log('📤 Returning', result.length, 'sets');
          return result;
        }

        if (normalizedSql.includes('FROM ratings WHERE set_id')) {
          return data.ratings.filter(r => r.set_id === params[0]);
        }

        if (normalizedSql.includes('FROM sets WHERE id')) {
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
            id: data.sets.length + 1,
            soundcloud_url: params[0],
            title: params[1],
            posted_by: params[2],
            posted_at: new Date().toISOString()
          };
          data.sets.push(newSet);
          console.log('✅ Set added! ID:', newSet.id, 'Total:', data.sets.length);
          console.log('📋 All sets:', JSON.stringify(data.sets));
          return { lastInsertRowid: newSet.id };
        }

        if (sql.includes('DELETE FROM sets')) {
          const setId = params[0];
          const setIndex = data.sets.findIndex(s => s.id === setId);
          if (setIndex >= 0) {
            data.sets.splice(setIndex, 1);
            // Also remove all ratings for this set (cascade delete)
            data.ratings = data.ratings.filter(r => r.set_id !== setId);
            console.log('🗑️  Set deleted! Remaining sets:', data.sets.length);
          }
          return {};
        }

        if (sql.includes('INSERT INTO ratings')) {
          const [set_id, username, rating, has_listened] = params;
          const existingIdx = data.ratings.findIndex(r => r.set_id === set_id && r.username === username);

          if (existingIdx >= 0) {
            data.ratings[existingIdx].rating = params[4];
            data.ratings[existingIdx].has_listened = params[5];
            data.ratings[existingIdx].created_at = new Date().toISOString();
          } else {
            data.ratings.push({
              id: data.ratings.length + 1,
              set_id,
              username,
              rating,
              has_listened,
              created_at: new Date().toISOString()
            });
          }
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
