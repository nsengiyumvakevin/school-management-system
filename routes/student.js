// routes/student.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Middleware to protect student routes
function checkStudent(req, res, next) {
  if (req.session.user && req.session.user.role === 'student') {
    next();
  } else {
    res.status(403).send('Access Denied');
  }
}

// Student Dashboard
router.get('/dashboard', checkStudent, (req, res) => {
  res.render('student/dashboard', { user: req.session.user });
});

// View all subjects
router.get('/subjects', checkStudent, (req, res) => {
  db.query(
    `SELECT subjects.*, users.name AS teacher_name 
     FROM subjects 
     LEFT JOIN users ON subjects.teacher_id = users.id`,
    (err, results) => {
      if (err) throw err;
      res.render('student/subjects', { subjects: results });
    }
  );
});

// Show profile edit form
router.get('/edit-profile', checkStudent, (req, res) => {
  const studentId = req.session.user.id;
  db.query("SELECT * FROM users WHERE id = ?", [studentId], (err, results) => {
    if (err) throw err;
    res.render('student/edit-profile', { user: results[0] });
  });
});

// Handle profile update
router.post('/edit-profile', checkStudent, (req, res) => {
  const studentId = req.session.user.id;
  const { name, email } = req.body;

  db.query("UPDATE users SET name = ?, email = ? WHERE id = ?", [name, email, studentId], (err) => {
    if (err) throw err;
    req.session.user.name = name;
    req.session.user.email = email;
    res.redirect('/student/dashboard');
  });
});

module.exports = router;
