import http from 'http';

  http.get('http://localhost:8080/api/sets', (res) => {
    if (res.statusCode === 200) {
      console.log('✓ Server is healthy');
      process.exit(0);
    } else {
      console.log('✗ Server returned', res.statusCode);
      process.exit(1);
    }
  }).on('error', (err) => {
    console.log('✗ Server not responding:', err.message);
    process.exit(1);
  });
