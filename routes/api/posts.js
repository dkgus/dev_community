const express = require("express");
const { check, validationResult } = require("express-validator");
const router = express.Router();
const auth = require("../../middleware/auth"); //사용자의 id를 가져오기위해 auth필요

const User = require("../../models/User");
const Post = require("../../models/Post");

/**
 *  @route  POST api/posts
 *  @desc   create a post
 *  @access private
 */

router.post(
  "/",
  auth,
  check("text", "글을 입력해주세요").notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findOne({ user: req.user.id }).select(
        "-password"
      );
      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.user,
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
    const post = await Post.find().sort({ date: -1 });
    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Sever error");
  }
});

module.exports = router;
