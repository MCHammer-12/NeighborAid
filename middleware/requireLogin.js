module.exports = function requireLogin(req, res, next) {
  if (!req.session || !req.session.user) {
      return res.redirect('/auth/login');  // ← FIXED
  }

  req.user = req.session.user;
  next();
};