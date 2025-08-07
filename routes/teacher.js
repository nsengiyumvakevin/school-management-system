// routes/teacher.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Middleware to protect teacher routes
function checkTeacher(req, res, next) {
  if (req.session.user && req.session.user.role === 'teacher') {
    next();
  } else {
    res.status(403).send('Access Denied');
  }
}

// Teacher Dashboard
router.get('/dashboard', checkTeacher, (req, res) => {
  res.render('teacher/dashboard', { user: req.session.user });
});

// View subjects assigned to this teacher
router.get('/subjects', checkTeacher, (req, res) => {
  const teacherId = req.session.user.id;
  db.query("SELECT * FROM subjects WHERE teacher_id = ?", [teacherId], (err, results) => {
    if (err) throw err;
    res.render('teacher/subjects', { subjects: results });
  });
});

// Show add subject form
router.get('/add-subject', checkTeacher, (req, res) => {
  res.render('teacher/add-subject');
});

// Add subject
router.post('/add-subject', checkTeacher, (req, res) => {
  const { name, description } = req.body;
  const teacherId = req.session.user.id;
  db.query("INSERT INTO subjects (name, description, teacher_id) VALUES (?, ?, ?)", 
    [name, description, teacherId], (err) => {
    if (err) throw err;
    res.redirect('/teacher/subjects');
  });
});

// Show edit subject form
router.get('/edit-subject/:id', checkTeacher, (req, res) => {
  const subjectId = req.params.id;
  const teacherId = req.session.user.id;

  db.query("SELECT * FROM subjects WHERE id = ? AND teacher_id = ?", [subjectId, teacherId], (err, results) => {
    if (err) throw err;
    if (results.length === 0) return res.status(404).send('Subject not found');
    res.render('teacher/edit-subject', { subject: results[0] });
  });
});

// Update subject
router.post('/edit-subject/:id', checkTeacher, (req, res) => {
  const { name, description } = req.body;
  const subjectId = req.params.id;
  const teacherId = req.session.user.id;

  db.query("UPDATE subjects SET name = ?, description = ? WHERE id = ? AND teacher_id = ?", 
    [name, description, subjectId, teacherId], (err) => {
    if (err) throw err;
    res.redirect('/teacher/subjects');
  });
});

// Delete subject
router.get('/delete-subject/:id', checkTeacher, (req, res) => {
  const subjectId = req.params.id;
  const teacherId = req.session.user.id;

  db.query("DELETE FROM subjects WHERE id = ? AND teacher_id = ?", [subjectId, teacherId], (err) => {
    if (err) throw err;
    res.redirect('/teacher/subjects');
  });
});

module.exports = router;
