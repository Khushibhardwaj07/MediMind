// The real work of authentication lives here (not in controllers).
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/env');
const AppError = require('../utils/appError');
const userModel = require('../models/user.model');
const refreshTokenModel = require('../models/refreshToken.model');

// SHA-256 is fine for refresh tokens because they are long random strings.
// (Passwords are short and guessable, so those need the slow bcrypt instead.)
const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

// A fake hash used when the email doesn't exist, so that a wrong email takes
// about as long as a wrong password. This stops attackers from discovering
// which emails are registered by measuring response time.
const dummyHashPromise = bcrypt.hash('not-a-real-password', config.bcryptRounds);

// Creates one access token (JWT) and one refresh token (random string).
const issueTokens = async (user) => {
  const accessToken = jwt.sign({ role: user.role }, config.jwt.accessSecret, {
    subject: user.id,
    expiresIn: config.jwt.accessExpiresIn,
    algorithm: 'HS256',
  });

  const refreshToken = crypto.randomBytes(48).toString('hex');
  const expiresAt = new Date(Date.now() + config.jwt.refreshDays * 24 * 60 * 60 * 1000);

  // We store only the hash. The real token goes to the user and nowhere else.
  await refreshTokenModel.create({
    userId: user.id,
    tokenHash: hashToken(refreshToken),
    expiresAt,
  });

  return { accessToken, refreshToken };
};

const signup = async ({ email, password, fullName }) => {
  const passwordHash = await bcrypt.hash(password, config.bcryptRounds);

  let user;
  try {
    user = await userModel.createUser({ email, passwordHash, fullName });
  } catch (err) {
    // 23505 is PostgreSQL's code for "unique rule broken" (email already used).
    if (err.code === '23505') {
      throw new AppError(409, 'An account with this email already exists');
    }
    throw err;
  }

  const tokens = await issueTokens(user);
  return { user: userModel.toPublicUser(user), ...tokens };
};

const login = async ({ email, password }) => {
  const user = await userModel.findByEmail(email);

  if (!user) {
    await bcrypt.compare(password, await dummyHashPromise);
    throw new AppError(401, 'Invalid email or password');
  }

  const passwordOk = await bcrypt.compare(password, user.password_hash);
  if (!passwordOk) {
    throw new AppError(401, 'Invalid email or password');
  }

  const tokens = await issueTokens(user);
  return { user: userModel.toPublicUser(user), ...tokens };
};

// Swaps a valid refresh token for a brand new pair of tokens.
const refresh = async (rawRefreshToken) => {
  const stored = await refreshTokenModel.findByHash(hashToken(rawRefreshToken));

  if (!stored) {
    throw new AppError(401, 'Invalid refresh token');
  }

  // An already-used token showing up again means it may have been stolen.
  // We cancel every session of this user to be safe.
  if (stored.revoked) {
    await refreshTokenModel.revokeAllForUser(stored.user_id);
    throw new AppError(401, 'Invalid refresh token');
  }

  if (new Date(stored.expires_at) < new Date()) {
    throw new AppError(401, 'Refresh token expired, please log in again');
  }

  // Use up the old token. If someone else just used it, we lose the race and stop.
  const claimed = await refreshTokenModel.revokeIfActive(stored.id);
  if (!claimed) {
    throw new AppError(401, 'Invalid refresh token');
  }

  const user = await userModel.findById(stored.user_id);
  if (!user) {
    throw new AppError(401, 'Invalid refresh token');
  }

  const tokens = await issueTokens(user);
  return { user: userModel.toPublicUser(user), ...tokens };
};

// Logging out = cancelling that refresh token. Unknown tokens are ignored quietly.
const logout = async (rawRefreshToken) => {
  await refreshTokenModel.revokeByHash(hashToken(rawRefreshToken));
};

module.exports = { signup, login, refresh, logout };