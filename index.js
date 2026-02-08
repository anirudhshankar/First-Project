const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Parse form data (for POST body)
app.use(express.urlencoded({ extended: true }));

// Hello World route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Login form (GET) – show the form
app.get('/login', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Login</title>
      </head>
      <body>
        <h1>Login</h1>
        <form method="POST" action="/login">
          <label for="username">User name</label>
          <input type="text" id="username" name="username" required>
          <br><br>
          <label for="password">Password</label>
          <input type="password" id="password" name="password" required>
          <br><br>
          <button type="submit">Submit</button>
        </form>
      </body>
    </html>
  `);
});

// Login form (POST) – handle form submission
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  res.send(`Received: user name = ${username}, password = ${password}`);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
