const fs = require("fs");

const User = require("../models/user");
const Hospital = require("../models/hospital");
const Doctor = require("../models/doctor");

const assignImage = async (type, item, nameFile) => {
  if (!item) {
    return false;
  }
  const oldPath = `./uploads/${type}/${item.img}`;
  if (fs.existsSync(oldPath)) {
    //Delete prev image
    fs.unlinkSync(oldPath);
  }
  item.img = nameFile;
  await item.save();
  return true;
};

const updateImage = async (type, id, nameFile) => {
  let item = [];
  switch (type) {
    case "users":
      item = await User.findById(id);
      assignImage(type, item, nameFile);
      break;
    case "hospitals":
      item = await Hospital.findById(id).populate("user", "name");
      assignImage(type, item, nameFile);
      break;
    case "doctors":
      item = await Doctor.findById(id)
        .populate("user", "name img")
        .populate("hospital", "name img");
      assignImage(type, item, nameFile);
      break;
    default:
      res.status(400).json({
        ok: false,
        msg: "Not result for that table or id",
      });
      break;
  }
};

module.exports = {
  updateImage,
};
