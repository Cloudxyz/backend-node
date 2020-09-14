/*
    Ruta: /api/login
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { validateFields } = require("../middlewares/validate-fields");
const { login } = require("../controllers/auth");

const router = Router();

//Routes
router.post(
  "/",
  [
    check("password", "The password is mandatory").not().isEmpty(),
    check("email", "The email no have a valid format").isEmail(),
    validateFields,
  ],
  login
);

module.exports = router;
