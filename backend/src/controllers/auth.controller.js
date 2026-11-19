// Controllers take the request, call a service, and send the response.
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/appError');
const authService = require('../services/auth.service');
const userModel = require('../models/user.model');

const signup = asyncHandler(async (req, res) => {
  const result = await authService.signup(req.body);
  res.status(201).json(result);
});

const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);
  res.status(200).json(result);
});

const refresh = asyncHandler(async (req, res) => {
  const result = await authService.refresh(req.body.refreshToken);
  res.status(200).json(result);
});

const logout = asyncHandler(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.status(200).json({ message: 'Logged out' });
});

// Returns the currently logged-in user. req.user was set by the authenticate middleware.
const me = asyncHandler(async (req, res) => {
  const user = await userModel.findById(req.user.id);
  if (!user) {
    throw new AppError(401, 'Invalid or expired token');
  }
  res.status(200).json({ user: userModel.toPublicUser(user) });
});

module.exports = { signup, login, refresh, logout, me };