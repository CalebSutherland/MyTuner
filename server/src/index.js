require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;

const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};


/*#############################################
##############   LOGIN / SIGNUP   #############
#############################################*/

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM users WHERE username = $1', [username]);

    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const user = result.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
    console.log("Logged in:", username);
    res.status(200).json({ message: 'Login successful', token, username });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    client.release();
  }
});

app.post('/api/signup', async (req, res) => {
  const { username, password, confirmPassword, themes, selectedThemeIndex, main_colors, font_colors } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  const client = await pool.connect();
  try {
    const existingUser = await client.query('SELECT * FROM users WHERE username = $1', [username]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await hashPassword(password);

    const userInsertResult = await client.query(
      'INSERT INTO users (username, password, main_colors, font_colors) VALUES ($1, $2, $3, $4) RETURNING id',
      [username, hashedPassword, main_colors, font_colors]
    );

    const userId = userInsertResult.rows[0].id;
    const insertedThemeIds = [];

    for (const theme of themes) {
      const result = await client.query(
        'INSERT INTO themes (user_id, color, font_color, image) VALUES ($1, $2, $3, $4) RETURNING id',
        [userId, theme.color, theme.font_color, theme.image]
      );
      insertedThemeIds.push(result.rows[0].id);
    }

    const selectedThemeId = insertedThemeIds[selectedThemeIndex];
    await client.query(
      'UPDATE users SET selected_theme_id = $1 WHERE id = $2',
      [selectedThemeId, userId]
    );

    res.status(201).json({ message: 'Sign-up successful' });
    console.log("Signed up: ", username);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    client.release();
  }
});


/*#############################################
##################   THEMES   #################
#############################################*/

app.get('/api/themes/:username', async (req, res) => {
  const { username } = req.params;
  const client = await pool.connect();

  try {
    const userResult = await client.query('SELECT * FROM users WHERE username = $1', [username]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = userResult.rows[0];
    const themesResult = await client.query('SELECT * FROM themes WHERE user_id = $1', [user.id]);

    const selectedThemeResult = await client.query(
      'SELECT * FROM themes WHERE id = $1',
      [user.selected_theme_id]
    );

    const themes = themesResult.rows || [];
    const selectedTheme = selectedThemeResult.rows[0] || null;

    console.log("Themes loaded");
    res.json({ themes, selectedTheme, main_colors: user.main_colors, font_colors: user.font_colors });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    client.release();
  }
});

app.post('/api/users/:username/themes', async (req, res) => {
  const { username } = req.params;
  const { color, font_color, image } = req.body;
  const client = await pool.connect();

  try {
    // Fetch the user from the database
    const userResult = await client.query('SELECT * FROM users WHERE username = $1', [username]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = userResult.rows[0];

    // Insert new theme into the themes table
    const insertThemeResult = await client.query(
      'INSERT INTO themes (user_id, color, font_color, image) VALUES ($1, $2, $3, $4) RETURNING *',
      [user.id, color, font_color, image]
    );

    const newTheme = insertThemeResult.rows[0];

    await client.query(
      'UPDATE users SET selected_theme_id = $1 WHERE id = $2',
      [newTheme.id, user.id]
    );

    res.status(200).json({ message: 'Theme saved', newTheme });
    console.log("Saved theme successfully");
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    client.release();
  }
});

app.delete('/api/users/:username/themes', async (req, res) => {
  const { username } = req.params;
  const { color, font_color, image } = req.body;
  const client = await pool.connect();

  try {
    // Get user
    const userResult = await client.query('SELECT * FROM users WHERE username = $1', [username]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    const user = userResult.rows[0];

    // Get all user's themes
    const allThemesResult = await client.query('SELECT * FROM themes WHERE user_id = $1', [user.id]);
    const allThemes = allThemesResult.rows;

    if (allThemes.length <= 1) {
      return res.status(400).json({ message: 'Cannot delete the last remaining theme.' });
    }

    // Find the theme to delete
    const themeResult = await client.query(
      'SELECT * FROM themes WHERE user_id = $1 AND color = $2 AND font_color = $3 AND image = $4',
      [user.id, color, font_color, image]
    );
    if (themeResult.rows.length === 0) {
      return res.status(404).json({ message: 'Theme not found' });
    }

    const themeToDelete = themeResult.rows[0];

    // If this was the selected theme, assign another one
    if (user.selected_theme_id === themeToDelete.id) {
      const remainingThemes = allThemes.filter(t => t.id !== themeToDelete.id);
      const newSelected = remainingThemes[0]; // Choose the first remaining one
      await client.query(
        'UPDATE users SET selected_theme_id = $1 WHERE id = $2',
        [newSelected.id, user.id]
      );
    }

    // Delete the theme
    await client.query('DELETE FROM themes WHERE id = $1', [themeToDelete.id]);

    res.status(200).json({ message: 'Theme deleted' });
    console.log("Theme deleted successfully");
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    client.release();
  }
});

app.patch('/api/users/:username/selected-theme', async (req, res) => {
  const { color, font_color, image } = req.body;
  const { username } = req.params;

  const client = await pool.connect();
  try {
    // Fetch the user from the database
    const userResult = await client.query('SELECT * FROM users WHERE username = $1', [username]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = userResult.rows[0];

    const themeResult = await client.query(
      'SELECT * FROM themes WHERE user_id = $1 AND color = $2 AND font_color = $3 AND image = $4',
      [user.id, color, font_color, image]
    );

    if (themeResult.rows.length === 0) {
      return res.status(404).json({ message: 'Theme not found' });
    }

    const theme = themeResult.rows[0];

    // Update the selected_theme_id for the user
    await client.query(
      'UPDATE users SET selected_theme_id = $1 WHERE id = $2',
      [theme.id, user.id]
    );

    res.status(200).json({ message: 'Selected theme updated' });
    console.log("Theme applied successfully");
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    client.release();
  }
});

app.get('/api/users/:username/colors', async (req, res) => {
  const { username } = req.params;

  const client = await pool.connect();
  try {
    const userResult = await client.query('SELECT * FROM users WHERE username = $1', [username]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = userResult.rows[0];
    const main_colors = user.main_colors || [];
    const font_colors = user.font_colors || [];

    console.log("Color lists loaded");

    res.json({
      main_colors,
      font_colors,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    client.release();
  }
});

app.put('/api/users/:username/colors', async (req, res) => {
  const { username } = req.params;
  const { main_colors, font_colors } = req.body;

  const client = await pool.connect();
  try {
    // Fetch the user from the database
    const userResult = await client.query('SELECT * FROM users WHERE username = $1', [username]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = userResult.rows[0];

    // Update mainColors and fontColors if provided
    if (main_colors) {
      await client.query(
        'UPDATE users SET main_colors = $1 WHERE id = $2',
        [main_colors, user.id]
      );
    }

    if (font_colors) {
      await client.query(
        'UPDATE users SET font_colors = $1 WHERE id = $2',
        [font_colors, user.id]
      );
    }

    console.log("Color lists updated");
    res.status(200).json({ message: 'Colors updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    client.release();
  }
});


/*#############################################
##################   TUNING   #################
#############################################*/

app.get('/api/users/:username/tunings', async (req, res) => {
  const { username } = req.params;
  const client = await pool.connect();

  try {
    const userResult = await client.query('SELECT id FROM users WHERE username = $1', [username]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    const userId = userResult.rows[0].id;

    const tuningsResult = await client.query('SELECT tuning FROM tunings WHERE user_id = $1', [userId]);
    const customTunings = tuningsResult.rows.map(row => row.tuning);

    res.json({ customTunings });
    console.log("Tunings loaded");
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    client.release();
  }
});

app.put('/api/users/:username/tunings', async (req, res) => {
  const { username } = req.params;
  const { customTunings } = req.body;

  if (!Array.isArray(customTunings)) {
    return res.status(400).json({ message: 'customTunings must be an array of arrays' });
  }

  const client = await pool.connect();

  try {
    const userResult = await client.query('SELECT id FROM users WHERE username = $1', [username]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    const userId = userResult.rows[0].id;

    await client.query('BEGIN');

    // Delete old tunings
    await client.query('DELETE FROM tunings WHERE user_id = $1', [userId]);

    // Insert new tunings
    for (const tuning of customTunings) {
      await client.query('INSERT INTO tunings (user_id, tuning) VALUES ($1, $2)', [userId, tuning]);
    }

    await client.query('COMMIT');
    console.log("Tunings updated");
    res.status(200).json({ message: 'Tunings updated' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    client.release();
  }
});


app.get('/api/ping', (_req, res) => {
  res.send({ message: 'pong from the backend' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});