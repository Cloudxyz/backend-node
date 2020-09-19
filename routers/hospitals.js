/*
    Hospitals
    Ruta: /api/hospitals
*/

const { Router } = require("express");
const { check } = require("express-validator");
const {
  getHospitals,
  createHospital,
  updateHospital,
  deleteHospital,
} = require("../controllers/hospitals");
const { validateFields } = require("../middlewares/validate-fields");
const { validateJWT } = require("../middlewares/validate-jwt");

const router = Router();

router.get("/", getHospitals);

router.post(
  "/create",
  [
    validateJWT,
    check("name", "The name is mandatory").not().isEmpty(),
    validateFields,
  ],
  createHospital
);

router.put(
  "/update/:id",
  validateJWT,
  [check("name", "The name is mandatory").not().isEmpty(), validateFields],
  updateHospital
);

router.delete("/delete/:id", validateJWT, deleteHospital);

module.exports = router;
