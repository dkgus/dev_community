const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth"); //사용자의 id를 가져오기위해 auth필요

const Profile = require("../../models/Profile");
const User = require("../../models/User");

/**
 *  @route  GET api/profile/me
 *  @desc   Get current users profile
 *  @access private
 */

router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      "user",
      ["name", "avatar"]
    );

    //user는 Profile스키마 내부의 user를 의미함
    //req.user.id로만  접근가능(토큰에서 꺼내오는것이기때문)
    //populate("대상 스키마",["필요한 컬럼1","필요한 컬럼2"])

    if (!profile) {
      return res.status(400).json({ msg: "해당 유저의 프로필이 없습니다" });
    }
    res.json(profile);
  } catch (err) {
    console.error(err.status);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
