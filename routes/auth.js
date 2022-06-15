const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

//REGISTER
router.post("/registerUser", async (req, res) => {

  const newUser = new User({
    name: req.body.name,
    lastName: req.body.lastName,
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.SECRET_KEY,
     ).toString(),
  });

  try {
    const savedUser = await newUser.save();
    return res.status(201).json(savedUser);
  } catch(e) {
    return res.status(500).json(e);
  }
});

//REGISTER
router.post("/register", async (req, res) => {

  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.SECRET_KEY,
     ).toString(),
  });

  try {
    const savedUser = await newUser.save();
    return res.status(201).json(savedUser);
  } catch(e) {
    return res.status(500).json(e);
  }
});

//LOGIN

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({username: req.body.username});

    if (!user) {
      return res.status(401).json("Username not found!");
    }

    const origPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.SECRET_KEY,
    ).toString(CryptoJS.enc.Utf8);

    if (origPassword !== req.body.password) {
      return res.status(401).json("Wrong password!");
    }

    const accessToken = jwt.sign({
      id: user._id,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET_KEY,
    {expiresIn: "3d"},
  );
    const {password, ...others} = user._doc;
    return res.status(200).json({...others, accessToken});

  } catch(e) {
    return res.status(500).json(e);
  }
})

module.exports = router;
