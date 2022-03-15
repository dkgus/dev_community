const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");

const User = require("../../models/User");

/**
 *  @route  GET api/auth
 *  @desc   Test route
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

module.exports = router;
