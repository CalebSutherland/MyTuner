require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { defaultThemes, defaultSelectedTheme } = require('../defaultThemes');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;

const users = {
  caleb: {
    password: 'hashed_pw_here',
    themes: [/* array of themes */],
    selectedTheme: { color: "#...", fontColor: "#...", image: "/..." },
    mainColors: [/* array of colors */],
    fontColors: [/* array of colors*/],
    customTuning: [/* list of tunings */]
  }
};

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

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  if (users[username]) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const hashedPassword = await hashPassword(password);

  users[username] = {
    password: hashedPassword,
    themes: defaultThemes,
    selectedTheme: defaultSelectedTheme,
    mainColors: defaultThemes.map(theme => theme.color),
    fontColors: ["#000000", "#FFFFFF"]
  };

  console.log('All users:', users);

  res.status(201).json({ message: 'Sign-up successful' });
});


app.get('/api/themes/:username', (req, res) => {
  const user = users[req.params.username];
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ themes: user.themes || [], selectedTheme: user.selectedTheme });
});

app.post('/api/users/:username/themes', (req, res) => {
  const { color, fontColor, image } = req.body;
  const user = users[req.params.username];
  if (!user) return res.status(404).json({ message: 'User not found' });

  const newTheme = { color, fontColor, image };

  if (!user.themes) user.themes = [];
  user.themes.push(newTheme);

  res.status(200).json({ message: 'Theme saved' });
  console.log("Saved: ", user.themes);
});

app.delete('/api/users/:username/themes', (req, res) => {
  const { color, fontColor, image } = req.body;
  const user = users[req.params.username];
  if (!user) return res.status(404).json({ message: 'User not found' });

  user.themes = user.themes.filter(
    (theme) =>
      theme.color !== color ||
      theme.fontColor !== fontColor ||
      theme.image !== image
  );

  res.status(200).json({ message: 'Theme deleted' });
  console.log("Deleted: ", user.themes);
});

app.patch('/api/users/:username/selected-theme', (req, res) => {
  const { color, fontColor, image } = req.body;
  const user = users[req.params.username];
  if (!user) return res.status(404).json({ message: 'User not found' });

  user.selectedTheme = { color, fontColor, image };
  res.status(200).json({ message: 'Selected theme updated' });
  console.log("Theme Applied: ", user.selectedTheme);
});

app.get('/api/users/:username/colors', (req, res) => {
  const user = users[req.params.username];
  if (!user) return res.status(404).json({ message: 'User not found' });

  res.json({
    mainColors: user.mainColors || [],
    fontColors: user.fontColors || []
  });
});

app.put('/api/users/:username/colors', (req, res) => {
  const { mainColors, fontColors } = req.body;
  const user = users[req.params.username];
  if (!user) return res.status(404).json({ message: 'User not found' });

  if (mainColors) user.mainColors = mainColors;
  if (fontColors) user.fontColors = fontColors;

  res.status(200).json({ message: 'Colors updated' });
});


app.get('/api/users/:username/tunings', (req, res) => {
  const user = users[req.params.username];
  if (!user) return res.status(404).json({ message: 'User not found' });

  res.json({ customTunings: user.customTunings || [] });
});

app.put('/api/users/:username/tunings', (req, res) => {
  const { customTunings } = req.body;
  const user = users[req.params.username];
  if (!user) return res.status(404).json({ message: 'User not found' });

  if (Array.isArray(customTunings)) {
    user.customTunings = customTunings;
  }

  res.status(200).json({ message: 'Tunings updated' });
});


app.get('/api/ping', (_req, res) => {
  res.send({ message: 'pong from the backend' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});