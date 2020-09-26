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
const {
  validateJWT,
  validateAdminRole,
  validateAdminRoleSameUser,
} = require("../middlewares/validate-jwt");

const router = Router();

router.get("/", validateJWT, getUsers);

router.post(
  "/create",
  [
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
    validateAdminRoleSameUser,
    check("name", "The name is mandatory").not().isEmpty(),
    check("email", "The email no have a valid format").isEmail(),
    check("role", "The role is mandatory").not().isEmpty(),
    validateFields,
  ],
  updateUser
);

router.delete("/delete/:id", [validateJWT, validateAdminRole], deleteUser);

module.exports = router;
