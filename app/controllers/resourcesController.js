const db = require('../db/query');

exports.listResources = async (req, res) => {
  const household = await db.query(
    "SELECT id FROM households WHERE user_id=$1",
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
    [household.rows[0].id]
  );

  // Build resource.resourceType object for EJS
  const formatted = resources.rows.map(r => ({
    ...r,
    resourceType: {
      name: r.type_name,
      category: r.type_category,
      description: r.type_description
    }
  }));

  res.render('resources/list', {
    user: req.user,
    resources: formatted
  });
};

exports.showAddForm = async (req, res) => {
  const types = await db.query("SELECT * FROM resource_types ORDER BY name");

  res.render('resources/form', {
    user: req.user,
    resourceTypes: types.rows,
    isEdit: false,
    selectedType: null
  });
};

// FIX: Renamed from addResource → handleAdd
exports.handleAdd = async (req, res) => {
  const { resourceTypeId, quantity, description, isAvailable } = req.body;

  const household = await db.query(
    "SELECT id FROM households WHERE user_id=$1",
    [req.user.id]
  );

  await db.query(
    `INSERT INTO resources (household_id, resource_type_id, quantity, description, is_available)
     VALUES ($1, $2, $3, $4, $5)`,
    [household.rows[0].id, resourceTypeId, quantity, description, isAvailable ? true : false]
  );

  res.redirect('/resources');
};

exports.showEditForm = async (req, res) => {
  const id = req.params.id;

  const resource = await db.query("SELECT * FROM resources WHERE id=$1", [id]);
  const types = await db.query("SELECT * FROM resource_types ORDER BY name");

  res.render('resources/form', {
    user: req.user,
    resource: resource.rows[0],
    resourceTypes: types.rows,
    isEdit: true
  });
};

// FIX: Renamed from updateResource → handleUpdate
exports.handleUpdate = async (req, res) => {
  const id = req.params.id;
  const { resourceTypeId, quantity, description, isAvailable } = req.body;

  await db.query(
    `UPDATE resources
     SET resource_type_id=$1, quantity=$2, description=$3, is_available=$4
     WHERE id=$5`,
    [resourceTypeId, quantity, description, isAvailable ? true : false, id]
  );

  res.redirect('/resources');
};

// FIX: Renamed from deleteResource → handleDelete
exports.handleDelete = async (req, res) => {
  const id = req.params.id;

  await db.query("DELETE FROM resources WHERE id=$1", [id]);

  res.redirect('/resources');
};