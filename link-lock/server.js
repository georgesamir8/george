const express = require('express');
const path = require('path');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const Database = require('better-sqlite3');

const app = express();
const PORT = process.env.PORT || 3000;

// Setup views and static
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: false }));
app.use('/public', express.static(path.join(__dirname, 'public')));

// DB (file: link-lock/data.db)
const dbPath = path.join(__dirname, 'data.db');
const db = new Database(dbPath);

// Initialize table
db.prepare(
  `CREATE TABLE IF NOT EXISTS links (
    id TEXT PRIMARY KEY,
    url TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    hint TEXT,
    created_at INTEGER NOT NULL
  )`
).run();

const insertStmt = db.prepare('INSERT INTO links (id, url, password_hash, hint, created_at) VALUES (?, ?, ?, ?, ?)');
const getStmt = db.prepare('SELECT id, url, password_hash, hint, created_at FROM links WHERE id = ?');

function generateId() {
  return crypto.randomBytes(6).toString('hex'); // 12 chars
}

app.get('/', (req, res) => {
  res.redirect('/create');
});

app.get('/create', (req, res) => {
  res.render('create', { error: null, values: {} });
});

app.post('/create', (req, res) => {
  const { url, password, hint } = req.body;
  if (!url || !password) {
    return res.status(400).render('create', { error: 'URL and password are required', values: req.body });
  }

  const id = generateId();
  const hash = bcrypt.hashSync(password, 10);
  const createdAt = Date.now();

  try {
    insertStmt.run(id, url, hash, hint || null, createdAt);
  } catch (err) {
    console.error('DB insert error', err);
    return res.status(500).render('create', { error: 'Internal error', values: req.body });
  }

  const link = `${req.protocol}://${req.get('host')}/l/${id}`;
  res.render('created', { id, link });
});

app.get('/l/:id', (req, res) => {
  const id = req.params.id;
  const row = getStmt.get(id);
  if (!row) return res.status(404).send('Not found');
  res.render('unlock', { id: row.id, hint: row.hint || null, error: null });
});

app.post('/l/:id', (req, res) => {
  const id = req.params.id;
  const { password } = req.body;
  const row = getStmt.get(id);
  if (!row) return res.status(404).send('Not found');

  if (!password) {
    return res.status(400).render('unlock', { id: row.id, hint: row.hint || null, error: 'Password is required' });
  }

  const ok = bcrypt.compareSync(password, row.password_hash);
  if (!ok) {
    return res.status(401).render('unlock', { id: row.id, hint: row.hint || null, error: 'Incorrect password' });
  }

  // success -> redirect to stored URL
  return res.redirect(row.url);
});

app.get('/health', (req, res) => res.send('ok'));

app.listen(PORT, () => {
  console.log(`link-lock app listening on http://localhost:${PORT}`);
});
