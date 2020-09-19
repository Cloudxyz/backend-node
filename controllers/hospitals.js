const { response } = require("express");

const Hospital = require("../models/hospital");
const { generateJWT } = require("../helpers/jwt");

const getHospitals = async (req, res = response) => {
  const hospitals = await Hospital.find().populate("user", "name");
  res.json({
    ok: true,
    hospitals,
  });
};

const createHospital = async (req, res = response) => {
  const uid = req.uid;
  console.log(req);
  const { name } = req.body;
  const hospital = new Hospital({
    user: uid,
    ...req.body,
  });
  try {
    const hospitalExist = await Hospital.findOne({ name });

    if (hospitalExist) {
      return res.status(400).json({
        ok: false,
        msg: "The name is already taken",
      });
    }

    //Save Hospital
    await hospital.save();

    res.json({
      ok: true,
      hospital,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Error inesperado",
    });
  }
};

const updateHospital = async (req, res = response) => {
  const id = req.params.id;
  const uid = req.uid;

  try {
    const hospitalDB = await Hospital.findById(id);

    if (!hospitalDB) {
      return res.status(404).json({
        ok: false,
        msg: "The hospital not exist",
      });
    }

    const changesHospital = {
      ...req.body,
      user: uid,
    };

    const hospitalUpdated = await Hospital.findByIdAndUpdate(
      id,
      changesHospital,
      {
        new: true,
      }
    );

    res.json({
      ok: true,
      hospital: hospitalUpdated,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error inesperado",
    });
  }
};

const deleteHospital = async (req, res = response) => {
  const id = req.params.id;
  try {
    const hospitalDB = await Hospital.findById(id);

    if (!hospitalDB) {
      return res.status(404).json({
        ok: false,
        msg: "The hospital not exist",
      });
    }

    const { ...fields } = req.body;

    fields.active = false;

    const hospitalDelete = await Hospital.findByIdAndUpdate(id, fields, {
      new: true,
    });

    res.status(200).json({
      ok: true,
      hospital: hospitalDelete,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error inesperado",
    });
  }
};

module.exports = {
  getHospitals,
  createHospital,
  updateHospital,
  deleteHospital,
};
