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
        return res.json({ msg: "수정되었습니다", profile });
      }

      // Create
      profile = new Profile(profileFileds);
      await profile.save();
      return res.json({ msg: "생성되었습니다", profile });
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

/**
 *  @route  DELETE api/profile
 *  @desc   Delete profile & user & posts
 *  @access private
 */

router.delete("/", auth, async (req, res) => {
  try {
    await Promise.all([
      //@todo remove user posts
      await Profile.findOneAndRemove({ user: req.user.id }),
      await User.findOneAndRemove({ _id: req.user.id }),
    ]);

    //user model 안에는 user가 없기때문에 _id로 조회해야함

    res.json({ msg: "삭제되었습니다" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

/**
 *  @route  PATCH api/profile/experience
 *  @desc   add profile experience
 *  @access private
 */
router.patch(
  "/experience",
  [
    auth,
    [
      check("title", "제목은 필수입니다").not().isEmpty(),
      check("company", "회사를 기입해주세요").not().isEmpty(),
      check("from", "입사일을 기입해주세요").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      Profile.findOne({ user: req.user.id }).then((profile) => {
        console.log("req.user_id", req.user.id);
        if (!profile) return;

        const newExp = {
          title: req.body.title,
          company: req.body.company,
          from: req.body.from,
          location: req.body.location,
          to: req.body.to,
          current: true,
          description: req.body.description,
        };

        profile.experience.unshift(newExp);
        profile.save();
        res.json({ msg: "저장되었습니다.", profile });
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).json("Server Error");
    }
  }
);

/**
 *  @route  DELETE api/profile/experience/:exp_id
 *  @desc   delete experience from profile
 *  @access private
 */
router.delete("/experience/:exp_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    //get remove index(experience._id를 찾는 것)
    const removeIndex = profile.experience
      .map((itme) => itme.id)
      .indexOf(req.params.exp_id);

    profile.experience.splice(removeIndex, 1);
    await profile.save();
    console.log("removeIndex", removeIndex);

    res.json({ msg: "삭제되었습니다" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server Error");
  }
});

/**
 *  @route  PATCH api/profile/education
 *  @desc   add profile education
 *  @access private
 */
router.patch(
  "/education",
  auth,
  [
    check("school", "학교를 입력해주세요").not().isEmpty(),
    check("degree", "학위를 입력해주세요").not().isEmpty(),
    check("fieldofstudy", "전공을 입력해주세요").not().isEmpty(),
    check("from", "입학일을 기입해주세요").not().isEmpty(),
  ],
  (req, res) => {
    try {
      Profile.findOne({ user: req.user.id }).then((profile) => {
        console.log("req.user.id", req.user.id);
        if (!profile) return;

        const newEdu = {
          school: req.body.school,
          degree: req.body.degree,
          fieldofstudy: req.body.fieldofstudy,
          from: req.body.from,
          to: req.body.to,
          current: false,
          description: req.body.description,
        };

        profile.education.unshift(newEdu);
        profile.save();
        res.json({ msg: "저장되었습니다.", profile });
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).json("Server Error");
    }
  }
);

/**
 *  @route  DELETE api/profile/education/:edu_id
 *  @desc   delete education from profile
 *  @access private
 */
router.delete("/education/:edu_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    //get remove index(education._id를 찾는 것)
    const removeIndex = profile.education
      .map((itme) => itme.id)
      .indexOf(req.params.edu_id);

    profile.education.splice(removeIndex, 1);
    await profile.save();

    res.json({ msg: "삭제되었습니다" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server Error");
  }
});

module.exports = router;
