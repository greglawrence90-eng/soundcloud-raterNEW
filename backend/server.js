import express from 'express';

  const app = express();
  const PORT = process.env.PORT || 8080;

  app.get('/', (req, res) => {
    res.send('<h1>🎵 Server is running!</h1>');
  });

  app.get('/api/test', (req, res) => {
    res.json({ status: 'ok', message: 'API works!' });
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log('✓ Server running on port', PORT);
  });
