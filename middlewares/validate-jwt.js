const jwt = require("jsonwebtoken");
const User = require("../models/user");

const validateJWT = (req, res, next) => {
  const token = req.header("x-token");

  if (!token) {
    return res.status(401).json({
      ok: false,
      msg: "Token is not present in request",
    });
  }

  try {
    const { uid } = jwt.verify(token, process.env.JWT_SECRET);

    req.uid = uid;
    next();
  } catch (error) {
    return res.status(401).json({
      ok: false,
      msg: "Invalid Token",
    });
  }
};

const validateAdminRole = async (req, res, next) => {
  const token = req.header("x-token");
  const uid = req.uid;

  if (!token) {
    return res.status(401).json({
      ok: false,
      msg: "Token is not present in request",
    });
  }

  try {
    const userDB = await User.findById(uid);

    if (!userDB) {
      return res.status(404).json({
        ok: false,
        msg: "User not found",
      });
    }

    if (userDB.role != "ADMIN_ROLE") {
      return res.status(403).json({
        ok: false,
        msg: "Only Admin can make changes",
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      ok: false,
      msg: "Contact to administrator",
    });
  }
};

const validateAdminRoleSameUser = async (req, res, next) => {
  const token = req.header("x-token");
  const uid = req.uid;
  const id = req.params.id;

  if (!token) {
    return res.status(401).json({
      ok: false,
      msg: "Token is not present in request",
    });
  }

  try {
    const userDB = await User.findById(uid);

    if (!userDB) {
      return res.status(404).json({
        ok: false,
        msg: "User not found",
      });
    }

    if (userDB.role === "ADMIN_ROLE" || uid === id) {
      next();
    } else {
      return res.status(403).json({
        ok: false,
        msg: "Only Admin can make changes",
      });
    }
  } catch (error) {
    return res.status(401).json({
      ok: false,
      msg: "Contact to administrator",
    });
  }
};

module.exports = {
  validateJWT,
  validateAdminRole,
  validateAdminRoleSameUser,
};
