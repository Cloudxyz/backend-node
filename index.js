require("dotenv").config();

const express = require("express");
const cors = require("cors");

const { dbConnection } = require("./database/config");

// Create express server
const app = express();

// Config CORS
app.use(cors());

// Database
dbConnection();

// Routes
app.get("/", (req, res) => {
  res.json({
    ok: true,
    msg: "Hola mundo",
  });
});

app.listen(process.env.PORT, () => {
  console.log("Servidor corriendo en puerto " + process.env.PORT);
});
