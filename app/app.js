const express = require('express');
const path = require('path');
const session = require('express-session');

// middleware
const requireLogin = require('./middleware/requireLogin');

// routes
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const householdRoutes = require('./routes/household');
const resourcesRoutes = require('./routes/resources');
const directoryRoutes = require('./routes/directory');
const alertsRoutes = require('./routes/alerts');
const membersRoutes = require('./routes/members');
const settingsRoutes = require('./routes/settings');
const neighborhoodsRoutes = require('./routes/neighborhoods');
const profileRoutes = require('./routes/profile');

const app = express();

// view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// static files
app.use(express.static(path.join(__dirname, 'public')));

// body parsing
app.use(express.urlencoded({ extended: true }));

// session
app.use(
  session({
    secret: "neighboraidsecret",
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }
  })
);

// debugging: show session
app.use((req, res, next) => {
  console.log("CURRENT SESSION:", req.session);
  next();
});

// attach user from session
app.use((req, res, next) => {
  if (req.session.user) req.user = req.session.user;
  next();
});

// make user available to EJS
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// landing
app.get('/', (req, res) => {
  res.render('landing');
});

// logout
app.post('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/auth/login'));
});

// routes
app.use('/auth', authRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/household', requireLogin, householdRoutes);
app.use('/resources', requireLogin, resourcesRoutes);
app.use('/directory', requireLogin, directoryRoutes);
app.use('/alerts', requireLogin, alertsRoutes);
app.use('/members', requireLogin, membersRoutes);
app.use('/settings', requireLogin, settingsRoutes);
app.use('/neighborhoods', requireLogin, neighborhoodsRoutes);
app.use('/profile', requireLogin, profileRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`NeighborAid running on http://localhost:${PORT}`));