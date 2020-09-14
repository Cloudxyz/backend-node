const { response } = require("express");
const User = require("../models/user");
const Hospital = require("../models/hospital");
const Doctor = require("../models/doctor");

const getResults = async (req, res = response) => {
  const search = req.params.s;
  const regex = new RegExp(search, "i");
  const [users, hospitals, doctors] = await Promise.all([
    User.find({ name: regex }),
    Hospital.find({ name: regex }),
    Doctor.find({ name: regex }),
  ]);
  if (!users) {
    return res.status(200).json({
      ok: true,
      msg: `Not results for ${search}`,
    });
  }
  res.json({
    ok: true,
    users,
    hospitals,
    doctors,
  });
};

const getCollection = async (req, res = response) => {
  const table = req.params.table;
  const search = req.params.s;
  const regex = new RegExp(search, "i");
  let results = [];
  switch (table) {
    case "users":
      results = await User.find({ name: regex });
      break;
    case "hospitals":
      results = await Hospital.find({ name: regex }).populate("user", "name");
      break;
    case "doctors":
      results = await Doctor.find({ name: regex })
        .populate("user", "name img")
        .populate("hospital", "name img");
      break;
    default:
      res.status(400).json({
        ok: false,
        msg: `Not table ${table}`,
      });
      break;
  }

  if (!results) {
    return res.status(200).json({
      ok: true,
      msg: `Not results for ${search}`,
    });
  }
  res.json({
    ok: true,
    results,
  });
};

module.exports = {
  getResults,
  getCollection,
};
