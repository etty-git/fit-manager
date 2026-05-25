const Post = require("../models/Post");

// יצירת פוסט
const createPost = async (data) => {
  return await Post.create(data);
};

// כל הפוסטים
const getAllPosts = async () => {
  return await Post.find().sort({ createdAt: -1 });
};

// לייק
const likePost = async (postId) => {
  const post = await Post.findById(postId);
  post.likes += 1;
  return await post.save();
};

// הוספת תגובה
const addComment = async (postId, commentData) => {
  const post = await Post.findById(postId);
  post.comments.push(commentData);
  return await post.save();
};

module.exports = {
  createPost,
  getAllPosts,
  likePost,
  addComment
};