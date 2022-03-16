const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator");

const User = require("../../models/User");

/**
 *  @route  GET api/auth
 *  @desc   auth route
 *  @access public
 */

router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    // 미들웨어에서 decode.user에서 req.user로 id를 할당해줬음
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.stauts(500).send("Server Error");
  }
});

/**
 * @route    POST api/auth
 * @desc     Authenticate user & get token
 * @access   Public
 */

router.post(
  "/",
  check("email", "이메일 형식을 입력해주세요").isEmail(),
  check("password", "비밀번호를 입력해주세요").exists(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ errors: [{ msg: "없는 회원입니다" }] });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: "비밀번호가 일치하지 않습니다" }] });
      }

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: "5 days" },
        (err, token) => {
          if (err) throw err;
          res.json({ token, msg: "로그인되었습니다" });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
