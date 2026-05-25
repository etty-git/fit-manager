module.exports = function isInstructor(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.user.role !== "instructor") {
    return res.status(403).json({ message: "Instructor only" });
  }

  next();
};