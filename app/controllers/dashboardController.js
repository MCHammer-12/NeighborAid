const db = require('../db/query');

exports.showDashboard = async (req, res) => {
  try {

    const household = await db.query(
      "SELECT * FROM households WHERE user_id=$1",
      [req.user.id]
    );

    const resources = await db.query(
      `SELECT 
          r.*, 
          rt.name AS type_name,
          rt.category AS type_category,
          rt.description AS type_description
       FROM resources r
       JOIN resource_types rt ON r.resource_type_id = rt.id
       WHERE household_id=$1`,
      [household.rows[0]?.id]
    );

    // normalize same format as resourcesController
    const formattedResources = resources.rows.map(r => ({
      ...r,
      resourceType: {
        name: r.type_name,
        category: r.type_category,
        description: r.type_description
      }
    }));

    res.render('dashboard', {
      user: req.user,
      household: household.rows[0],
      resources: formattedResources,
      neighborhoods: [],
      householdMembers: []
    });

  } catch (err) {
    console.error("Dashboard load error:", err);
    res.status(500).send("Dashboard error");
  }
};