const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Parse JSON and form data (for POST body)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API: Hello World
app.get('/api/hello', (req, res) => {
  res.send('Hello World!');
});

// API: Login (POST) – handle form submission from React
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  res.send(`Received: user name = ${username}, password = ${password}`);
});

// Serve React build in production
const distPath = path.join(__dirname, 'client', 'dist');
app.use(express.static(distPath));

// Catch-all handler: serve index.html for non-API routes (SPA fallback)
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next(); // Let API routes pass through
  }
  res.sendFile(path.join(distPath, 'index.html'), (err) => {
    if (err) {
      res.status(500).send('Client not built. Run: cd client && npm run build');
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
