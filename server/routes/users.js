const express = require("express");
const router = express.Router();
const passport = require("passport");

const auth = require("../middlewares/auth");

const {
  createNewUser,
  login,
  getUserById,
  updateUser,
  deleteUser,
  googleAuthSuccess,
  logout
} = require("../controlers/UsersController");

// ================= Google Auth =================
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google callback → JWT flow (בלי session)
router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "http://localhost:5173/login"
  }),
  googleAuthSuccess
);

// ================= Auth =================
router.post("/", createNewUser);
router.post("/login", login);
router.post("/logout", logout);

// ================= Protected =================
router.get("/:id", auth, getUserById);
router.put("/:id", auth, updateUser);
router.delete("/:id", auth, deleteUser);

module.exports = router;