require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;

// Example in-memory "database" for users
const users = {};

// Helper function to hash passwords
const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

const validateUser = async (username, password) => {
  const user = users[username];
  if (!user) {
    return false;
  }
  return await bcrypt.compare(password, user.password);
};


app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  const validUser = await validateUser(username, password);
  if (!validUser) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
  console.log("Logged in:", username);
  res.status(200).json({ message: 'Login successful', token });
});


app.post('/api/signup', async (req, res) => {
  const { username, password, confirmPassword } = req.body;

  // Check if passwords match
  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  // Check if user already exists
  if (users[username]) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Hash the password
  const hashedPassword = await hashPassword(password);

  // Store the new user
  users[username] = { password: hashedPassword };

  console.log('All users:', users);

  res.status(201).json({ message: 'Sign-up successful' });
});

app.get('/api/ping', (_req, res) => {
  res.send({ message: 'pong from the backend' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});