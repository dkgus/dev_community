const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth"); //사용자의 id를 가져오기위해 auth필요
const { check, validationResult } = require("express-validator");

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

/**
 *  @route  POST api/profile
 *  @desc   Create or update user profile
 *  @access private
 */

router.post(
  "/",
  [
    auth,
    [
      check("status", "직업을 적어주세요").not().isEmpty(),
      check("skills", "스킬을 적어주세요").not().isEmpty(),
    ],
  ],

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    }

    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin,
    } = req.body;

    //build profile object
    const profileFileds = {};
    profileFileds.user = req.user.id;
    if (company) profileFileds.company = company;
    if (website) profileFileds.website = website;
    if (location) profileFileds.location = location;
    if (bio) profileFileds.bio = bio;
    if (status) profileFileds.status = status;
    if (githubusername) profileFileds.githubusername = githubusername;
    if (skills) {
      profileFileds.skills = skills.split(",").map((skill) => skill.trim());
    }
    console.log(skills);
    console.log(profileFileds.skills);
    //res.send("HELLO");

    //build social object
    profileFileds.social = {};
    if (youtube) profileFileds.social.youtube = youtube;
    if (twitter) profileFileds.social.twitter = twitter;
    if (facebook) profileFileds.social.facebook = facebook;
    if (linkedin) profileFileds.social.linkedin = linkedin;
    if (instagram) profileFileds.social.instagram = instagram;

    try {
      let profile = await Profile.findOne({ user: req.user.id });
      //update
      if (profile) {
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFileds },
          { new: true }
        );
        return res.json(profile);
      }

      // Create
      profile = new Profile(profileFileds);
      await profile.save();
      return res.json(profile);
    } catch (err) {
      console.error(err.message);
      return res.status(500).send("Server Error");
    }
  }
);

/**
 *  @route  GET api/profile
 *  @desc   Get all profiles
 *  @access Public
 */

router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

/**
 *  @route  GET api/profile/user/:user_id
 *  @desc   Get profile by user ID
 *  @access Public
 */

router.get("/user/:user_id", async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate("user", ["name", "avatar"]);
    //id가 url로부터 오기때문에 params.id가 됨

    if (!profile)
      return res.status(400).json({ msg: "프로필이 존재하지않습니다" });
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(400).json({ msg: "프로필이 존재하지않습니다" });
    }
    res.status(500).send("Server Error");
  }
});
module.exports = router;
