const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const {
  getMessages,
  createMessage
} = require("../controlers/MessageController");

router.get("/", auth, getMessages);
router.post("/", auth, createMessage);

module.exports = router;
