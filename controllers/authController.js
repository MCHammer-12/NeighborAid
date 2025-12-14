const db = require('../db/query');

exports.showLogin = (req, res) => {
  res.render('login', { error: null });
};

exports.handleLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await db.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.render("login", { error: "Invalid email or password" });
    }

    const foundUser = result.rows[0];

    // simple match for this project
    if (password !== foundUser.password_hash) {
      return res.render("login", { error: "Invalid email or password" });
    }

    req.session.user = {
      id: foundUser.id,
      firstName: foundUser.first_name,
      lastName: foundUser.last_name,
      email: foundUser.email,
      role: foundUser.role
    };

    console.log("AFTER LOGIN, SESSION =", req.session);
    return res.redirect("/dashboard");

  } catch (err) {
    console.log("LOGIN ERROR:", err);
    return res.render("login", { error: "Unexpected error occurred" });
  }
};

exports.showRegister = (req, res) => {
  res.render('register', { error: null, formData: {} });
};

exports.handleRegister = async (req, res) => {
  const { first_name, last_name, email, password, confirmPassword, neighborhood_code } = req.body;

  console.log("REGISTER DATA:", { first_name, last_name, email, neighborhood_code, type: typeof neighborhood_code }); // Debug log

  // Password match
  if (password !== confirmPassword) {
    return res.render("register", { error: "Passwords do not match", formData: req.body });
  }

  // Validate neighborhood_code exists and is not empty
  // Convert to string and trim to handle number inputs
  const neighborhoodCodeValue = neighborhood_code ? String(neighborhood_code).trim() : '';
  
  if (!neighborhoodCodeValue || neighborhoodCodeValue === '') {
    return res.render("register", { error: "Neighborhood code is required", formData: req.body });
  }

  try {
    // Check duplicate email
    const existing = await db.query(
      "SELECT id FROM users WHERE email=$1",
      [email]
    );

    if (existing.rows.length > 0) {
      return res.render("register", { error: "Email already in use", formData: req.body });
    }

    // Create user
    const newUser = await db.query(
      `
      INSERT INTO users (first_name, last_name, email, password_hash)
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [first_name, last_name, email, password]
    );

    const userId = newUser.rows[0].id;

    console.log("Created user with ID:", userId, "Neighborhood code:", neighborhoodCodeValue); // Debug log

    // Create household with neighborhood_code - use the validated value
    const householdResult = await db.query(
      `
      INSERT INTO households (user_id, neighborhood_code)
      VALUES ($1, $2)
      RETURNING *
      `,
      [userId, neighborhoodCodeValue]
    );

    console.log("Created household:", householdResult.rows[0]); // Debug log

    req.session.user = {
      id: userId,
      firstName: newUser.rows[0].first_name,
      lastName: newUser.rows[0].last_name,
      email: newUser.rows[0].email,
      role: newUser.rows[0].role
    };

    return res.redirect("/dashboard");

  } catch (err) {
    console.log("REGISTER ERROR:", err);
    return res.render("register", { error: "Unexpected error occurred", formData: req.body });
  }
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
};
