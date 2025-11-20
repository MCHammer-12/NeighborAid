const db = require('../db/query');

// Show the household view page
exports.showProfile = async (req, res) => {
  const result = await db.query(
    `SELECT * FROM households WHERE user_id = $1`,
    [req.user.id]
  );

  res.render('household/view', {
    user: req.user,
    household: result.rows[0]
  });
};

// Show the edit form
exports.showEditForm = async (req, res) => {
  const id = req.params.id;

  const result = await db.query(
    `SELECT * FROM households WHERE id = $1`,
    [id]
  );

  res.render('household/edit', {
    user: req.user,
    household: result.rows[0]
  });
};

// Update household data
exports.updateProfile = async (req, res) => {
  const { address, latitude, longitude, phone_number, readiness_level, notes } = req.body;

  await db.query(
    `UPDATE households
     SET address=$1, latitude=$2, longitude=$3, phone_number=$4,
         readiness_level=$5, notes=$6
     WHERE user_id=$7`,
    [address, latitude, longitude, phone_number, readiness_level, notes, req.user.id]
  );

  res.redirect('/household/view');
};

// Route for /household (homepage of household section)
exports.showHouseholdHome = async (req, res) => {
  const result = await db.query(
    `SELECT * FROM households WHERE user_id = $1`,
    [req.user.id]
  );

  res.render('household/view', {
    user: req.user,
    household: result.rows[0]
  });
};