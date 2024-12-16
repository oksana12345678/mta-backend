import createHttpError from 'http-errors';
import {
  loginUser,
  logoutUser,
  registerUser,
  requestResetToken,
  resetPassword,
} from '../services/auth.js';
import UserCollection from '../db/models/User.js';

export const registerUserController = async (req, res) => {
  const user = await registerUser(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: {
      name: user.name,
      email: user.email,
      _id: user._id,
    },
  });
};

export const loginUserController = async (req, res) => {
  const { accessToken, user } = await loginUser(req.body);

  res.json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      user: {
        name: user.name,
        email: user.email,
      },
      accessToken: accessToken,
    },
  });
};

export const logoutUserController = async (req, res) => {
  if (req.cookies.sessionId) {
    await logoutUser(req.cookies.sessionId);
  }

  res.status(204).send();
};

export const refreshUserSessionController = async (req, res, next) => {
  const { userId } = req.body;
  const user = await UserCollection.findOne({ userId: userId });
  try {
    const accessToken =
      req.cookies.refreshToken || req.headers['authorization']?.split(' ')[1];

    console.log('Authorization header:', req.headers.authorization);
    console.log('User from token:', req.user);

    if (!accessToken) {
      throw createHttpError(401, 'Refresh token is missing');
    }

    res.json({
      status: 200,
      message: 'Access token refreshed successfully!',
      data: {
        user: {
          name: user.name,
          email: user.email,
        },
        accessToken: accessToken,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const requestResetEmailController = async (req, res, next) => {
  try {
    await requestResetToken(req.body.email);

    res.json({
      status: 200,
      message: 'Reset password email has been successfully sent.',
      data: {},
    });
  } catch (err) {
    createHttpError(500, 'Failed to send the email, please try again later.');
    next(err);
  }
};

export const resetPasswordController = async (req, res) => {
  await resetPassword(req.body);

  res.json({
    message: 'Password has been successfully reset.',
    status: 200,
    data: {},
  });
};
