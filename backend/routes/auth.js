// routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const db = require('../db');
require('dotenv').config();

const router = express.Router();

/**
 * POST /api/auth/register
 * body: { name, email, password }
 */
router.post(
  '/register',
  [
    body('name').optional().isString(),
    body('email').isEmail(),
    body('password').isLength({ min: 6 })
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, email, password } = req.body;
    db.get('SELECT id FROM users WHERE email = ?', [email], async (err, user) => {
      if (err) return res.status(500).json({ error: err.message });
      if (user) return res.status(400).json({ error: 'Email already registered' });

      const hashed = await bcrypt.hash(password, 10);
      db.run('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name || null, email, hashed], function (err2) {
        if (err2) return res.status(500).json({ error: err2.message });
        return res.status(201).json({ id: this.lastID, email });
      });
    });
  }
);

/**
 * POST /api/auth/login
 * body: { email, password }
 */
router.post('/login', [body('email').isEmail(), body('password').exists()], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body;

  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'secret123', { expiresIn: '7d' });
    return res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  });
});

module.exports = router;
