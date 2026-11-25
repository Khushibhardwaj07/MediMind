// SQL for "doctor_patient_access": which doctor may see which patient.
const { query } = require('../config/db');

// ON CONFLICT DO NOTHING: granting twice is harmless.
const grant = async (doctorId, patientId) => {
  await query(
    `INSERT INTO doctor_patient_access (doctor_id, patient_id)
     VALUES ($1, $2)
     ON CONFLICT DO NOTHING`,
    [doctorId, patientId]
  );
};

// Returns true if a row was actually removed.
const revoke = async (doctorId, patientId) => {
  const result = await query(
    'DELETE FROM doctor_patient_access WHERE doctor_id = $1 AND patient_id = $2',
    [doctorId, patientId]
  );
  return result.rowCount === 1;
};

const listDoctorsForPatient = async (patientId) => {
  const { rows } = await query(
    `SELECT u.id, u.full_name, u.email
     FROM doctor_patient_access a
     JOIN users u ON u.id = a.doctor_id
     WHERE a.patient_id = $1
     ORDER BY u.full_name`,
    [patientId]
  );
  return rows.map((r) => ({ id: r.id, fullName: r.full_name, email: r.email }));
};

const listPatientsForDoctor = async (doctorId) => {
  const { rows } = await query(
    `SELECT u.id, u.full_name, u.email
     FROM doctor_patient_access a
     JOIN users u ON u.id = a.patient_id
     WHERE a.doctor_id = $1
     ORDER BY u.full_name`,
    [doctorId]
  );
  return rows.map((r) => ({ id: r.id, fullName: r.full_name, email: r.email }));
};

// Used from Phase 6 on, before a doctor can open a patient's report.
const doctorHasAccess = async (doctorId, patientId) => {
  const { rows } = await query(
    'SELECT 1 FROM doctor_patient_access WHERE doctor_id = $1 AND patient_id = $2',
    [doctorId, patientId]
  );
  return rows.length === 1;
};

module.exports = {
  grant,
  revoke,
  listDoctorsForPatient,
  listPatientsForDoctor,
  doctorHasAccess,
};