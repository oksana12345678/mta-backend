import createHttpError from 'http-errors';
// import { ONE_DAY } from '../constants/index.js';
import {
  loginUser,
  logoutUser,
  // refreshAccessToken,
  // refreshSession,
  registerUser,
  requestResetToken,
  resetPassword,
} from '../services/auth.js';
import UserCollection from '../db/models/User.js';

// import jwt from 'jsonwebtoken';
// import env from '../utils/evn.js';

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
//TODO find out why cookies are not transmitted via https
// const setupSession = (res, session) => {
//   res.cookie('refreshToken', session.refreshToken, {
//     httpOnly: true,
//     expires: new Date(Date.now() + ONE_DAY),
//   });
//   res.cookie('sessionId', session._id, {
//     httpOnly: true,
//     expires: new Date(Date.now() + ONE_DAY),
//   });
// };
// const generateRefreshToken = (userId) => {
//   return jwt.sign(
//     { userId },
//     'your_refresh_token_secret',
//     { expiresIn: '30d' }, // Термін дії рефреш-токену
//   );
// };

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
    //TODO update token
    // const decoded = refreshAccessToken(accessToken, req.body); // Decode the refresh token

    // const newAccessToken = jwt.sign(
    //   { userId: decoded.userId },
    //   env('JWT_SECRET'),
    //   {
    //     expiresIn: '1h', // Adjust expiration as needed
    //   },
    // );
    // console.log(newAccessToken);

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
    next(err); // Pass the error to the next middleware or error handler
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
