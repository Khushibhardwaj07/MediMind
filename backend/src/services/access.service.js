const AppError = require('../utils/appError');
const userModel = require('../models/user.model');
const accessModel = require('../models/access.model');

// A patient gives a doctor access by typing the doctor's email.
const grant = async (patientId, doctorEmail) => {
  const doctor = await userModel.findByEmail(doctorEmail);

  // One message for "no such email" and "that person isn't a doctor".
  if (!doctor || doctor.role !== 'doctor') {
    throw new AppError(404, 'No doctor account found with that email');
  }

  await accessModel.grant(doctor.id, patientId);
  return { id: doctor.id, fullName: doctor.full_name, email: doctor.email };
};

const revoke = async (patientId, doctorId) => {
  const removed = await accessModel.revoke(doctorId, patientId);
  if (!removed) {
    throw new AppError(404, 'That doctor does not have access');
  }
};

const listDoctors = (patientId) => accessModel.listDoctorsForPatient(patientId);

const listPatients = (doctorId) => accessModel.listPatientsForDoctor(doctorId);

module.exports = { grant, revoke, listDoctors, listPatients };