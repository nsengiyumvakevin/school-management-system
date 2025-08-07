const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../config/db');
const router = express.Router();

// Show login form
router.get('/login', (req, res) => {
  res.render('login', { error: null });
});

// Show signup form
router.get('/signup', (req, res) => {
  res.render('signup', { error: null });
});

// Handle login
router.post('/login', (req, res) => {
  const { email, password, role } = req.body;

  const sql = 'SELECT * FROM users WHERE email = ? AND role = ?';
  db.query(sql, [email, role], async (err, results) => {
    if (err) return res.send('Database error.');
    if (results.length === 0) {
      return res.render('login', { error: 'Invalid credentials.' });
    }

    const user = results[0];

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.render('login', { error: 'Incorrect password.' });
    }

    // Save session
    req.session.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    // Redirect by role
    if (user.role === 'admin') res.redirect('/admin/dashboard');
    else if (user.role === 'teacher') res.redirect('/teacher/dashboard');
    else if (user.role === 'student') res.redirect('/student/dashboard');
    else res.redirect('/login');
  });
});

// Handle signup
router.post('/signup', async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!['teacher', 'student'].includes(role)) {
    return res.render('signup', { error: 'Only teacher or student allowed.' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const sql = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)';

  db.query(sql, [name, email, hashedPassword, role], (err) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.render('signup', { error: 'Email already exists.' });
      }
      return res.render('signup', { error: 'Error signing up.' });
    }

    res.redirect('/login');
  });
});

// Handle logout
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

module.exports = router;
