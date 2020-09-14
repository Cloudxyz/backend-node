const path = require("path");
const fs = require("fs");

const { response } = require("express");
const { v4: uuidv4 } = require("uuid");

const { updateImage } = require("../helpers/update-image");

const makeUpload = async (req, res) => {
  const type = req.params.type;
  const id = req.params.id;
  const validTypes = ["users", "hospitals", "doctors"];
  let item = [];
  try {
    // Validate Type
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        ok: false,
        msg: "No valid type of collection",
      });
    }

    // Validate File
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({
        ok: false,
        msg: "No files were uploaded",
      });
    }

    //Process Image
    const fileUpload = req.files.img;
    const nameSplit = fileUpload.name.split(".");
    const extension = nameSplit[nameSplit.length - 1];
    const validMimeTypes = ["png", "jpg", "jpeg", "gif"];

    if (!validMimeTypes.includes(extension)) {
      return res.status(400).json({
        ok: false,
        msg: "No valid extension for the file",
      });
    }

    // Generate name for file
    const nameFile = `${uuidv4()}.${extension}`;

    const pathFile = `./uploads/${type}/${nameFile}`;

    // Move file to path folder
    fileUpload.mv(pathFile, (err) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          ok: false,
          msg: "Error to move image",
        });
      }

      updateImage(type, id, nameFile);
    });

    res.json({
      ok: true,
      item,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error inesperado",
    });
  }
};

const getFile = (req, res = response) => {
  const type = req.params.type;
  const file = req.params.file;

  const pathImg = path.join(__dirname, `../uploads/${type}/${file}`);
  const pathDefaultImg = path.join(__dirname, `../uploads/no-image.png`);

  //Default Image
  if (fs.existsSync(pathImg)) {
    //Delete prev image
    res.sendFile(pathImg);
  } else {
    res.sendFile(pathDefaultImg);
  }
};

module.exports = {
  makeUpload,
  getFile,
};
