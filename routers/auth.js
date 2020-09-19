/*
    Ruta: /api/login
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { validateFields } = require("../middlewares/validate-fields");
const { validateJWT } = require("../middlewares/validate-jwt");

const { login, loginGoogle, renewToken } = require("../controllers/auth");

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

router.post(
  "/google",
  [check("token", "The token is mandatory").not().isEmpty(), validateFields],
  loginGoogle
);

router.get("/renew", validateJWT, renewToken);

module.exports = router;
