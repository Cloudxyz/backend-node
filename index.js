require("dotenv").config();
const path = require("path");

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

// Publi Directory
app.use(express.static("public"));

// Routes
app.use("/api/users", require("./routers/users"));
app.use("/api/hospitals", require("./routers/hospitals"));
app.use("/api/doctors", require("./routers/doctors"));
app.use("/api/login", require("./routers/auth"));
app.use("/api/search", require("./routers/searchs"));
app.use("/api/upload", require("./routers/uploads"));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "public/index.html"));
});

app.listen(process.env.PORT, () => {
  console.log("Servidor corriendo en puerto " + process.env.PORT);
});
