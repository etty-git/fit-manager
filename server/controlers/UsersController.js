const userService = require("../services/userService");
const jwt = require("jsonwebtoken");

// ================= Create =================
const createNewUser = async (req, res) => {
  try {
    const result = await userService.createUser(req.body);

    res.status(201).json({
      message: "User created",
      ...result,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ================= Login =================
const login = async (req, res) => {
  try {
    const result = await userService.loginUser(
      req.body.email,
      req.body.password
    );

    res.json({ ...result, message: "login succeeded" });
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};

// ================= Get =================
const getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    res.json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// ================= Update =================
const updateUser = async (req, res) => {
  try {
    const user = await userService.updateUser(
      req.params.id,
      req.body,
      req.user
    );

    res.json({
      message: "User updated",
      user,
    });
  } catch (err) {
    res.status(403).json({ message: err.message });
  }
};

// ================= Delete =================
const deleteUser = async (req, res) => {
  try {
    await userService.deleteUser(req.params.id, req.user);

    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(403).json({ message: err.message });
  }
};

// ================= Google Auth Success =================
const googleAuthSuccess = (req, res) => {
  const user = req.user;

  const token = jwt.sign(
    {
      id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  // שולח את הטוקן לפרונט
  res.redirect(
    `${process.env.FRONTEND_URL}/login-success?token=${token}`
  );
};

// ================= Logout =================
const logout = async (req, res) => {
  try {
    // JWT = אין באמת logout בצד שרת
    res.json({ message: "logout succeeded" });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

module.exports = {
  createNewUser,
  login,
  getUserById,
  updateUser,
  deleteUser,
  googleAuthSuccess,
  logout,
};