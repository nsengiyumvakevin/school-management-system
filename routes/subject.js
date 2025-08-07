const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { ensureAuthenticated, ensureAdminOrTeacher } = require('../middleware/auth');

// List all subjects
router.get('/', ensureAuthenticated, (req, res) => {
  db.query('SELECT * FROM subjects', (err, results) => {
    if (err) throw err;
    res.render('subject/index', { subjects: results, user: req.session.user });
  });
});

// Add subject - form
router.get('/add', ensureAdminOrTeacher, (req, res) => {
  res.render('subject/add', { user: req.session.user });
});

// Add subject - post
router.post('/add', ensureAdminOrTeacher, (req, res) => {
  const { name, description } = req.body;
  db.query('INSERT INTO subjects (name, description) VALUES (?, ?)', [name, description], (err) => {
    if (err) throw err;
    res.redirect('/subject');
  });
});

// Edit subject - form
router.get('/edit/:id', ensureAdminOrTeacher, (req, res) => {
  db.query('SELECT * FROM subjects WHERE id = ?', [req.params.id], (err, results) => {
    if (err) throw err;
    if (results.length === 0) return res.send('Subject not found');
    res.render('subject/edit', { subject: results[0], user: req.session.user });
  });
});

// Edit subject - post
router.post('/edit/:id', ensureAdminOrTeacher, (req, res) => {
  const { name, description } = req.body;
  db.query('UPDATE subjects SET name = ?, description = ? WHERE id = ?', [name, description, req.params.id], (err) => {
    if (err) throw err;
    res.redirect('/subject');
  });
});

// Delete subject
router.get('/delete/:id', ensureAdminOrTeacher, (req, res) => {
  db.query('DELETE FROM subjects WHERE id = ?', [req.params.id], (err) => {
    if (err) throw err;
    res.redirect('/subject');
  });
});

module.exports = router;
