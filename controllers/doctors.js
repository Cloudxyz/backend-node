const { response } = require("express");

const Doctor = require("../models/doctor");
const { generateJWT } = require("../helpers/jwt");

const getDoctors = async (req, res = response) => {
  const doctors = await Doctor.find()
    .populate("user", "name img")
    .populate("hospital", "name img");
  res.json({
    ok: true,
    doctors,
  });
};

const createDoctor = async (req, res = response) => {
  const uid = req.uid;
  console.log(req);
  const { name } = req.body;
  const doctor = new Doctor({
    user: uid,
    ...req.body,
  });
  try {
    const doctorExist = await Doctor.findOne({ name });

    if (doctorExist) {
      return res.status(400).json({
        ok: false,
        msg: "The name is already taken",
      });
    }

    //Save Doctor
    await doctor.save();

    res.json({
      ok: true,
      doctor,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Error inesperado",
    });
  }
};

const updateDoctor = async (req, res = response) => {
  const id = req.params.id;
  const hid = req.params.hospital;
  const uid = req.uid;

  try {
    const doctorDB = await Doctor.findById(id);

    if (!doctorDB) {
      return res.status(404).json({
        ok: false,
        msg: "The Doctor not exist",
      });
    }

    const changesDoctor = {
      ...req.body,
      user: uid,
      hospital: hid,
    };

    const doctorUpdated = await Doctor.findByIdAndUpdate(id, changesDoctor, {
      new: true,
    });

    res.json({
      ok: true,
      doctor: doctorUpdated,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error inesperado",
    });
  }
};

const deleteDoctor = async (req, res = response) => {
  const id = req.params.id;
  try {
    const doctorDB = await Doctor.findById(id);

    if (!doctorDB) {
      return res.status(404).json({
        ok: false,
        msg: "The Doctor not exist",
      });
    }

    const { ...fields } = req.body;

    fields.active = false;

    const doctorDelete = await Doctor.findByIdAndUpdate(id, fields, {
      new: true,
    });

    res.status(200).json({
      ok: true,
      doctor: doctorDelete,
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
  getDoctors,
  createDoctor,
  updateDoctor,
  deleteDoctor,
};
