require("dotenv").config();

const express = require("express");
const cors = require("cors");

const { dbConnection } = require("./database/config");

// Create express server
const app = express();

// Config CORS
app.use(cors());

//Read and Parse body
app.use(express.json());

// Database
dbConnection();

// Routes
app.use("/api/users", require("./routers/users"));
app.use("/api/login", require("./routers/auth"));

app.listen(process.env.PORT, () => {
  console.log("Servidor corriendo en puerto " + process.env.PORT);
});
