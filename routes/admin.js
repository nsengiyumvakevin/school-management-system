// routes/admin.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Middleware to protect admin routes
function checkAdmin(req, res, next) {
  if (req.session.user && req.session.user.role === 'admin') {
    next();
  } else {
    res.status(403).send('Access Denied');
  }
}

// Admin Dashboard
router.get('/dashboard', checkAdmin, (req, res) => {
  res.render('admin/dashboard', { user: req.session.user });
});

// View all teachers
router.get('/teachers', checkAdmin, (req, res) => {
  db.query("SELECT * FROM users WHERE role = 'teacher'", (err, results) => {
    if (err) throw err;
    res.render('admin/teachers', { teachers: results });
  });
});

// Add teacher
router.post('/add-teacher', checkAdmin, (req, res) => {
  const { name, email, password } = req.body;
  db.query("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'teacher')", 
    [name, email, password], (err) => {
    if (err) throw err;
    res.redirect('/admin/teachers');
  });
});

// Delete teacher
router.get('/delete-teacher/:id', checkAdmin, (req, res) => {
  const id = req.params.id;
  db.query("DELETE FROM users WHERE id = ? AND role = 'teacher'", [id], (err) => {
    if (err) throw err;
    res.redirect('/admin/teachers');
  });
});

// View all students
router.get('/students', checkAdmin, (req, res) => {
  db.query("SELECT * FROM users WHERE role = 'student'", (err, results) => {
    if (err) throw err;
    res.render('admin/students', { students: results });
  });
});

// Add student
router.post('/add-student', checkAdmin, (req, res) => {
  const { name, email, password } = req.body;
  db.query("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'student')", 
    [name, email, password], (err) => {
    if (err) throw err;
    res.redirect('/admin/students');
  });
});

// Delete student
router.get('/delete-student/:id', checkAdmin, (req, res) => {
  const id = req.params.id;
  db.query("DELETE FROM users WHERE id = ? AND role = 'student'", [id], (err) => {
    if (err) throw err;
    res.redirect('/admin/students');
  });
});

// View subjects
router.get('/subjects', checkAdmin, (req, res) => {
  db.query("SELECT subjects.*, users.name AS teacher_name FROM subjects LEFT JOIN users ON subjects.teacher_id = users.id", 
  (err, results) => {
    if (err) throw err;
    res.render('admin/subjects', { subjects: results });
  });
});

// Add subject
router.post('/add-subject', checkAdmin, (req, res) => {
  const { name, description, teacher_id } = req.body;
  db.query("INSERT INTO subjects (name, description, teacher_id) VALUES (?, ?, ?)", 
    [name, description, teacher_id], (err) => {
    if (err) throw err;
    res.redirect('/admin/subjects');
  });
});

// Delete subject
router.get('/delete-subject/:id', checkAdmin, (req, res) => {
  const id = req.params.id;
  db.query("DELETE FROM subjects WHERE id = ?", [id], (err) => {
    if (err) throw err;
    res.redirect('/admin/subjects');
  });
});

// router.get('/', (req, res) => {
//   res.render('admin/dashboard'); // or send some response
// });

router.get('/', (req, res) => {
  res.render('admin/dashboard', { user: req.session.user }); // Pass user here
});

module.exports = router;
