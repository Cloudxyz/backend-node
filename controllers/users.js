const { response } = require("express");
const bcrypt = require("bcryptjs");

const User = require("../models/user");
const { generateJWT } = require("../helpers/jwt");
const user = require("../models/user");

const getUsers = async (req, res) => {
  const queryFrom = Number(req.query.from) || 0;
  const [users, total] = await Promise.all([
    // User.find({}).skip(queryFrom).limit(5),
    User.find({}).skip(queryFrom),
    User.count(),
  ]);
  res.json({
    ok: true,
    users,
    total,
  });
};

const createUser = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    const emailExist = await User.findOne({ email });

    if (emailExist) {
      return res.status(400).json({
        ok: false,
        msg: "The email is already taken",
      });
    }

    const user = new User(req.body);

    //Encrypt password
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(password, salt);

    //Save User
    await user.save();

    //Generate TOKEN
    const token = await generateJWT(user.id);

    res.json({
      ok: true,
      user,
      token,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Error inesperado",
    });
  }
};

const updateUser = async (req, res = response) => {
  const uid = req.params.id;

  try {
    const userDB = await User.findById(uid);

    const { password, google, email, ...fields } = req.body;

    if (!userDB) {
      return res.status(404).json({
        ok: false,
        msg: "The user not exist",
      });
    }

    if (userDB.email != email) {
      const emailExist = await User.findOne({ email });

      if (emailExist) {
        return res.status(400).json({
          ok: false,
          msg: "The email is already taken",
        });
      }
    }

    if (!userDB.google) {
      fields.email = email;
    } else if (userDB.email !== email) {
      return res.status(400).json({
        ok: false,
        msg: "Google Users cant change email",
      });
    }

    const userUpdated = await User.findByIdAndUpdate(uid, fields, {
      new: true,
    });

    res.json({
      ok: true,
      user: userUpdated,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error inesperado",
    });
  }
};

const deleteUser = async (req, res = response) => {
  const uid = req.params.id;
  try {
    const userDB = await User.findById(uid);

    if (!userDB) {
      return res.status(404).json({
        ok: false,
        msg: "The user not exist",
      });
    }

    const { password, google, email, ...fields } = req.body;

    fields.active = false;

    // const userDelete = await User.findByIdAndDelete(uid);
    const userDelete = await User.findByIdAndUpdate(uid, fields, {
      new: true,
    });

    res.status(200).json({
      ok: true,
      user: userDelete,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error inesperado",
    });
  }
};

module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
};
