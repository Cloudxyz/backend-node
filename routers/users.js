/*
    Users
    Ruta: /api/users
*/

const { Router } = require("express");
const { check } = require("express-validator");
const {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/users");
const { validateFields } = require("../middlewares/validate-fields");
const { validateJWT } = require("../middlewares/validate-jwt");

const router = Router();

router.get("/", validateJWT, getUsers);

router.post(
  "/create",
  [
    validateJWT,
    check("name", "The name is mandatory").not().isEmpty(),
    check("password", "The password is mandatory").not().isEmpty(),
    check("email", "The email no have a valid format").isEmail(),
    validateFields,
  ],
  createUser
);

router.put(
  "/update/:id",
  [
    validateJWT,
    check("name", "The name is mandatory").not().isEmpty(),
    check("email", "The email no have a valid format").isEmail(),
    check("role", "The role is mandatory").not().isEmpty(),
    validateFields,
  ],
  updateUser
);

router.delete("/delete/:id", validateJWT, deleteUser);

module.exports = router;
