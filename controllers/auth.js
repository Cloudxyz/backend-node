const { response } = require("express");
const bcrypt = require("bcryptjs");

const User = require("../models/user");
const { generateJWT } = require("../helpers/jwt");
const { verifyGoogleSignIn } = require("../helpers/verify-google-signin");

const login = async (req, res = response) => {
  const { email, password } = req.body;
  try {
    const userDB = await User.findOne({ email });

    if (!userDB) {
      return res.status(404).json({
        ok: false,
        msg: "The email or password are not valid",
      });
    }

    const validPassword = bcrypt.compareSync(password, userDB.password);

    if (!validPassword) {
      return res.status(404).json({
        ok: false,
        msg: "The email or password are not valid",
      });
    }

    //Generate TOKEN
    const token = await generateJWT(userDB.id);

    res.json({
      ok: true,
      token: token,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      ok: false,
      msg: "Error inesperado",
    });
  }
};

const loginGoogle = async (req, res = response) => {
  const googleToken = req.body.token;
  try {
    const { name, email, picture } = await verifyGoogleSignIn(googleToken);

    const userDB = await User.findOne({ email });
    let user;

    if (!userDB) {
      user = new User({
        name,
        email,
        password: "@@@",
        img: picture,
        google: true,
      });
    } else {
      user = userDB;
      user.google = true;
    }

    await user.save();

    //Generate TOKEN
    const token = await generateJWT(user.id);

    res.json({
      ok: true,
      token: token,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      ok: false,
      msg: "Invalid Token",
    });
  }
};

module.exports = {
  login,
  loginGoogle,
};
