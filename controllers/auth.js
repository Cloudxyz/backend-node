const { response } = require("express");
const bcrypt = require("bcryptjs");

const User = require("../models/user");
const { generateJWT } = require("../helpers/jwt");
const { verifyGoogleSignIn } = require("../helpers/verify-google-signin");
const { getMenuFrontend } = require("../helpers/menu-frontend");

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
      menu: getMenuFrontend(userDB.role),
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
      menu: getMenuFrontend(user.role),
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      ok: false,
      msg: "Invalid Token",
    });
  }
};

const renewToken = async (req, res = response) => {
  const uid = req.uid;
  //Generate TOKEN
  const token = await generateJWT(uid);
  const userDB = await User.findById(uid);

  res.json({
    ok: true,
    token,
    user: userDB,
    menu: getMenuFrontend(userDB.role),
  });
};

module.exports = {
  login,
  loginGoogle,
  renewToken,
};
