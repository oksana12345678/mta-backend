// import { ONE_DAY } from '../constants/index.js';
// import { refreshSession } from '../services/auth.js';

// const setupSession = (res, session) => {
//   res.cookie('refreshToken', session.refreshToken, {
//     httpOnly: true,
//     secure: true,
//     sameSite: 'None',
//     expires: new Date(Date.now() + ONE_DAY),
//   });
//   res.cookie('sessionId', session._id, {
//     httpOnly: true,
//     secure: true,
//     sameSite: 'None',
//     expires: new Date(Date.now() + ONE_DAY),
//   });
// };

// export const refreshUserSessionController = async (req, res) => {
//   console.log('REEEEEEEEEQ', req.cookies);
//   const session = await refreshSession({
//     sessionId: req.cookies.sessionId,
//     refreshToken: req.cookies.refreshToken,
//   });

//   console.log('Session:', session);
//   setupSession(res, session);

//   res.json({
//     status: 200,
//     message: 'Successfully refreshed a session!',
//     data: {
//       accessToken: session.accessToken,
//       user: {
//         name: req.user.name,
//         email: req.user.email,
//       },
//     },
//   });
// };
