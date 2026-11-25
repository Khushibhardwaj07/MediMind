const asyncHandler = require('../utils/asyncHandler');
const accessService = require('../services/access.service');
const audit = require('../services/audit.service');

// Patient: give a doctor access.
const grant = asyncHandler(async (req, res) => {
  const doctor = await accessService.grant(req.user.id, req.body.doctorEmail);
  audit.record(req, 'ACCESS_GRANTED', { entity: 'user', entityId: doctor.id });
  res.status(201).json({ doctor });
});

// Patient: see which doctors have access.
const listMyDoctors = asyncHandler(async (req, res) => {
  const doctors = await accessService.listDoctors(req.user.id);
  res.status(200).json({ doctors });
});

// Patient: take access away.
const revoke = asyncHandler(async (req, res) => {
  await accessService.revoke(req.user.id, req.params.doctorId);
  audit.record(req, 'ACCESS_REVOKED', { entity: 'user', entityId: req.params.doctorId });
  res.status(200).json({ message: 'Access removed' });
});

// Doctor: see the patients who gave access.
const listMyPatients = asyncHandler(async (req, res) => {
  const patients = await accessService.listPatients(req.user.id);
  res.status(200).json({ patients });
});

module.exports = { grant, listMyDoctors, revoke, listMyPatients };