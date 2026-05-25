require("dotenv").config();
console.log("SERVER FILE IS RUNNING");
const workoutRoutes = require('./routes/workoutRoutes');
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const passport = require("passport");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");

const corsOptions = require("./config/corsOptions");
const connectDb = require("./config/dbConn");
const { createDefaultAdmin } = require("./seedAdmin");

require("./config/passport");

const PORT = process.env.PORT || 7002;
const app = express();

connectDb();

app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);

app.use(morgan("dev"));
app.use(cors(corsOptions));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(passport.initialize());

app.use("/api/users", require("./routes/users"));
app.use("/api/classes", require("./routes/class"));
app.use("/api/payments", require("./routes/payment"));
app.use("/api/instructors", require("./routes/instructor"));
app.use("/api/bookings", require("./routes/booking"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/plan", require("./routes/plan"));
app.use("/api/posts", require("./routes/post"));
app.use("/api/messages", require("./routes/message"));
// שימוש בראוטר
app.use('/api/workout', workoutRoutes);
app.get("/", (req, res) => {
  res.json({ message: "ROOT WORKS" });
});

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Server Error",
  });
});

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");

  createDefaultAdmin()
    .catch((err) => {
      console.error("Default admin seed failed:", err.message);
    })
    .finally(() => {
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    });
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});
