// middleware/auth.js
function ensureAuthenticated(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  }
  res.redirect('/login');
}

function ensureAdminOrTeacher(req, res, next) {
  const role = req.session.user?.role;
  if (role === 'admin' || role === 'teacher') {
    return next();
  }
  res.status(403).send('Forbidden');
}

module.exports = { ensureAuthenticated, ensureAdminOrTeacher };
