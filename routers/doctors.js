/*
    Doctors
    Ruta: /api/doctors
*/

const { Router } = require("express");
const { check } = require("express-validator");
const {
  getDoctors,
  createDoctor,
  updateDoctor,
  deleteDoctor,
} = require("../controllers/doctors");
const { validateFields } = require("../middlewares/validate-fields");
const { validateJWT } = require("../middlewares/validate-jwt");

const router = Router();

router.get("/", getDoctors);

router.post(
  "/create",
  [
    validateJWT,
    check("name", "The name is mandatory").not().isEmpty(),
    check("hospital", "The hospital ID is invalid").isMongoId(),
    validateFields,
  ],
  createDoctor
);

router.put(
  "/update/:id",
  [check("name", "The name is mandatory").not().isEmpty(), validateFields],
  updateDoctor
);

router.delete("/delete/:id", deleteDoctor);

module.exports = router;
