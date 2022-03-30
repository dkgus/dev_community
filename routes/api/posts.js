const express = require("express");
const { check, validationResult } = require("express-validator");
const router = express.Router();
const auth = require("../../middleware/auth"); //사용자의 id를 가져오기위해 auth필요

const User = require("../../models/User");
const Post = require("../../models/Post");
const Profile = require("../../models/Profile");
const { json } = require("express/lib/response");

/**
 *  @route  POST api/posts
 *  @desc   create a post
 *  @access private
 */

router.post(
  "/",
  auth,
  [check("text", "글을 입력해주세요").notEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select("-password");
      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      });

      const post = await newPost.save();
      res.json({ msg: "정상적으로 등록되었습니다", post });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

/**
 *  @route  POST api/posts
 *  @desc   get all posts
 *  @access private
 */
router.get("/", auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Sever error");
  }
});

/**
 *  @route  POST api/posts/:id
 *  @desc   get post by id
 *  @access private
 */
router.get("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    //한개의 포스트(포스트자체의id)
    if (!post) {
      return res.status(404).json({ msg: "포스트가 없습니다." });
    }
    res.json(post);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "포스트가 없습니다." });
    }
    res.status(500).send("Sever error");
  }
});

/**
 *  @route  DELETE api/posts/:id
 *  @desc   delete a post
 *  @access private
 */
router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    //const post = await Post.deleteOne({ _id: req.params.id });

    if (!post) {
      return res.status(404).json({ msg: "포스트가 없습니다." });
    }

    //Check user
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    await post.remove();
    res.json({ msg: "포스트가 삭제되었습니다" });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "포스트가 없습니다." });
    }
    res.status(500).send("Server error");
  }
});

/**
 *  @route  PUT api/posts/like/:id
 *  @desc   Like a post
 *  @access private
 */
router.put("/like/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // 좋아요가 있을때 (true)
    if (post.likes.some((like) => like.user.toString() === req.user.id)) {
      return res.status(400).json({ msg: "이미 좋아요한 게시물 입니다." });
    }

    post.likes.unshift({ user: req.user.id });
    await post.save();
    res.json(post.likes);
  } catch (err) {
    console.error(err.message);

    res.status(500).send("Server error");
  }
});

/**
 *  @route  PUT api/posts/unlike/:id
 *  @desc   unlike a post
 *  @access private
 */
router.put("/unlike/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    console.log("post11", post);

    // 좋아요가 없을 때(false)
    if (!post.likes.some((like) => like.user.toString() === req.user.id)) {
      return res.status(400).json({ msg: "제거할 좋아요가 없습니다." });
    }

    // 좋아요 제거
    post.likes = post.likes.filter(
      ({ user }) => user.toString() !== req.user.id
    );
    console.log("remove", post);
    await post.save();
    return res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

/**
 *  @route  post api/posts/comment
 *  @desc   create a comment
 *  @access private
 */
router.post(
  "/comment/:id",
  auth,
  [check("text", "글을 입력해주세요").notEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const user = await User.findById(req.user.id).select("-password");
      const post = await Post.findById(req.params.id);

      const newComment = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      });
      post.comment.unshift(newComment);
      await post.save();
      res.json({ msg: "저장되었습니다.", post });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

/**
 *  @route  DELETE api/posts/comment/:id/:cmt_id
 *  @desc   delete a comment
 *  @access private
 */
router.delete("/comment/:id/:cmt_id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const removeIndex = post.comment
      .map((itme) => itme.id)
      .indexOf(req.params.exp_id);

    post.comment.splice(removeIndex, 1);
    await post.save();
    res.json({ msg: " 삭제되었습니다." });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
