const postService = require("../services/postService");

// יצירת פוסט
const createPost = async (req, res) => {
  try {
    const post = await postService.createPost(req.body);
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// קבלת פוסטים
const getPosts = async (req, res) => {
  try {
    const posts = await postService.getAllPosts();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// לייק
const likePost = async (req, res) => {
  try {
    const post = await postService.likePost(req.params.id);
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// תגובה
const addComment = async (req, res) => {
  try {
    const post = await postService.addComment(req.params.id, req.body);
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createPost,
  getPosts,
  likePost,
  addComment
};