/*
    Ruta: /api/login
*/

const { Router } = require("express");
const { getResults, getCollection } = require("../controllers/searchs");
const { validateJWT } = require("../middlewares/validate-jwt");

const router = Router();

//Routes
router.post("/:s", validateJWT, getResults);
router.post("/:table/:s", validateJWT, getCollection);

module.exports = router;
