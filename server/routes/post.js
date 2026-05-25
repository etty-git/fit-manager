const express = require("express");
const router = express.Router();
const postController = require("../controlers/postController");

// יצירת פוסט
router.post("/", postController.createPost);

// קבלת כל הפוסטים
router.get("/", postController.getPosts);

// לייק
router.post("/like/:id", postController.likePost);

// תגובה
router.post("/comment/:id", postController.addComment);

module.exports = router;