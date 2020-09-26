/*
    Ruta: /api/login
*/

const { Router } = require("express");
const { getResults, getCollection } = require("../controllers/searchs");
const { validateJWT } = require("../middlewares/validate-jwt");

const router = Router();

//Routes
router.get("/:s", validateJWT, getResults);
router.get("/:table/:s", validateJWT, getCollection);

module.exports = router;
