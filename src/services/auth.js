import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import UserCollection from '../db/models/User.js';
import SessionCollection from '../db/models/Session.js';
// import { randomBytes } from 'crypto';
import {
  FIFTEEN_MINUTES,
  ONE_DAY,
  SMTP,
  TEMPLATES_DIR,
} from '../constants/index.js';
import path from 'node:path';
import fs from 'node:fs/promises';
import handlebars from 'handlebars';
import jwt from 'jsonwebtoken';
import env from '../utils/evn.js';
import { sendEmail } from '../utils/sendEmail.js';

export const registerUser = async (payload) => {
  const user = await UserCollection.findOne({ email: payload.email });

  if (user) throw createHttpError(409, 'Email in use');

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  return await UserCollection.create({
    ...payload,
    password: encryptedPassword,
  });
};

export const loginUser = async (payload) => {
  const user = await UserCollection.findOne({ email: payload.email });

  console.log('Transfer user', user);
  if (!user) {
    throw createHttpError(404, 'User not found');
  }
  const isEqual = await bcrypt.compare(payload.password, user.password);

  if (!isEqual) {
    throw createHttpError(401, 'Unauthorized');
  }

  await SessionCollection.deleteOne({ userId: user._id });

  const accessToken = jwt.sign({ userId: user._id }, env('JWT_SECRET'), {
    expiresIn: '90m',
  });

  const refreshToken = jwt.sign({ userId: user._id }, env('JWT_SECRET'), {
    expiresIn: '1d',
  });

  return await SessionCollection.create({
    user,

    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
  });
};

export const logoutUser = async (sessionId) => {
  await SessionCollection.deleteOne({ _id: sessionId });
};

// const createSession = () => {
//   const accessToken = randomBytes(30).toString('base64');
//   const refreshToken = randomBytes(30).toString('base64');

//   return {
//     accessToken,
//     refreshToken,
//     accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
//     refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
//   };
// };

export const refreshAccessToken = (accessToken) => {
  try {
    // const user = UserCollection.findOne({ email: payload.email });

    // SessionCollection.deleteOne({ userId: user._id });

    const decoded = jwt.sign(accessToken, env('JWT_SECRET'));
    return decoded;
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw createHttpError(401, 'Refresh token has expired');
    }

    console.error(err);

    throw createHttpError(401, 'Invalid or expired refresh token');
  }
};

export const requestResetToken = async (email) => {
  const user = await UserCollection.findOne({ email });

  if (!user) {
    throw createHttpError(404, 'User not found!');
  }
  const resetToken = jwt.sign(
    {
      sub: user._id,
      email,
    },
    env('JWT_SECRET'),
    {
      expiresIn: '5m',
    },
  );
  const resetPasswordTemplateRath = path.join(
    TEMPLATES_DIR,
    'reset-password-email.html',
  );
  const templateSource = (
    await fs.readFile(resetPasswordTemplateRath)
  ).toString();

  const template = handlebars.compile(templateSource);

  const html = template({
    name: user.name,
    link: `${env('APP_DOMAIN')}/reset-password?token=${resetToken}`,
  });

  await sendEmail({
    from: env(SMTP.SMTP_FROM),
    to: email,
    subject: 'Reset your password!',
    html,
  });
};

export const resetPassword = async (payload) => {
  let entries;

  try {
    entries = jwt.verify(payload.token, env('JWT_SECRET'));
  } catch (err) {
    if (err instanceof Error)
      throw createHttpError(401, 'Token is expired or invalid.');
    throw err;
  }

  const user = await UserCollection.findOne({
    email: entries.email,
    _id: entries.sub,
  });
  if (!user) throw createHttpError(404, 'User not found!');

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  await UserCollection.updateOne(
    { _id: user._id },
    {
      password: encryptedPassword,
    },
  );
  await SessionCollection.deleteOne({ userId: user._id });
};
