/*
    Ruta: /api/upload
*/

const { Router } = require("express");
const fileUpload = require("express-fileupload");
const { makeUpload, getFile } = require("../controllers/uploads");
const { validateJWT } = require("../middlewares/validate-jwt");

const router = Router();
router.use(fileUpload());

//Routes
router.put("/:type/:id", validateJWT, makeUpload);
router.get("/:type/:file", validateJWT, getFile);

module.exports = router;
