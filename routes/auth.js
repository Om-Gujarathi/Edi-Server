const e = require("express");
const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const auth = require('../middlewares/auth');

const authRouter = express.Router();

authRouter.post("/api/signup", async (req, res) => {
  try {
    const { name, email, password , _id} = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ msg: "User with same email already exists!" });
    }

    const hashedPassword = await bcrypt.hash(password, 8);

    let user = new User({
      email,
      password: hashedPassword,
      name,
      _id
    });
    user = await user.save();
    res.json(user);
  } catch (error) {
    return res.status(500).json({ error: e.message });
  }
});

//Sign In Route:

authRouter.post("/api/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ msg: "User with this email does not exist!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ msg: "Incorrect Password" });
    }

    const token = jwt.sign({ id: user._id }, "passwordKey");
    res.json({token, ...user._doc});
  } catch (error) {
    return res.status(500).json({ error: e.message });
  }
});




authRouter.post("/tokenIsValid", async (req, res) => {
  try {
    const token = req.header('x-auth-token');
    if (!token) return false;
    const isVerified = jwt.verify(token, "passwordKey")
    if (!isVerified) return false;

    const user = await User.findById(isVerified.id);
    if (!user) return false;
    res.json(true);
  } catch (error) {
    return res.status(500).json({ error: e.message });
  }
});

//Get user data
authRouter.get('/', auth, async (req, res) => {
  const user = await User.findById(req.user);
  res.json({ token : req.token, ...user._doc });
})

module.exports = authRouter;
