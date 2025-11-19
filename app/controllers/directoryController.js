const db = require('../db/query');

exports.listHouseholds = async (req, res) => {
  const households = await db.query(`
    SELECT h.*, u.first_name, u.last_name
    FROM households h
    JOIN users u ON h.user_id = u.id
  `);

  res.render('directory', {
    user: req.user,
    households: households.rows
  });
};