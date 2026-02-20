const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const app = express();
app.use(cors());
app.use(express.json());

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
});
app.use('/api/', limiter);

const dbConfig = {
  host: process.env.DB_HOST || 'db',
  user: process.env.DB_USER || 'm347user',
  password: process.env.DB_PASSWORD || 'm347pass',
  database: process.env.DB_NAME || 'm347db',
};

let pool;

async function connectWithRetry(retries = 15, delay = 3000) {
  for (let i = 0; i < retries; i++) {
    try {
      pool = mysql.createPool(dbConfig);
      await pool.query('SELECT 1');
      console.log('Connected to database');
      return;
    } catch (err) {
      console.log(`DB connection attempt ${i + 1}/${retries} failed: ${err.message}`);
      if (i < retries - 1) await new Promise(r => setTimeout(r, delay));
    }
  }
  throw new Error('Could not connect to database after multiple retries');
}

// GET all todos
app.get('/api/todos', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM todos ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create todo
app.post('/api/todos', async (req, res) => {
  const { title } = req.body;
  if (!title || !title.trim()) {
    return res.status(400).json({ error: 'Title is required' });
  }
  try {
    const [result] = await pool.query('INSERT INTO todos (title) VALUES (?)', [title.trim()]);
    const [rows] = await pool.query('SELECT * FROM todos WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT toggle todo completed state
app.put('/api/todos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('UPDATE todos SET completed = NOT completed WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Todo not found' });
    const [rows] = await pool.query('SELECT * FROM todos WHERE id = ?', [id]);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE todo
app.delete('/api/todos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM todos WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Todo not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

connectWithRetry()
  .then(() => {
    app.listen(3000, () => console.log('Backend running on port 3000'));
  })
  .catch(err => {
    console.error(err.message);
    process.exit(1);
  });
