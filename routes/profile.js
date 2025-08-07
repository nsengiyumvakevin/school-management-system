const express = require('express');
const db = require('../config/db');
const { ensureAuthenticated } = require('../middleware/auth');

const router = express.Router();

// View Profile
router.get('/', ensureAuthenticated, (req, res) => {
  res.render('profile/view', { user: req.session.user });
});

// Edit Profile Form
router.get('/edit', ensureAuthenticated, (req, res) => {
  res.render('profile/edit', { user: req.session.user });
});

// Update Profile
router.post('/edit', ensureAuthenticated, (req, res) => {
  const { name, email } = req.body;
  const userId = req.session.user.id;

  db.query(
    'UPDATE users SET name = ?, email = ? WHERE id = ?',
    [name, email, userId],
    (err) => {
      if (err) return res.send('Error updating profile');
      req.session.user.name = name;
      req.session.user.email = email;
      res.redirect('/profile');
    }
  );
});

module.exports = router;
