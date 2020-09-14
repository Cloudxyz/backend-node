const { response } = require("express");
const bcrypt = require("bcryptjs");

const user = require("../models/user");
const { generateJWT } = require("../helpers/jwt");

const login = async (req, res = response) => {
  const { email, password } = req.body;
  try {
    const userDB = await user.findOne({ email });

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

module.exports = {
  login,
};
