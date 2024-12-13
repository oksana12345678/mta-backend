import jwt from 'jsonwebtoken';
import env from './evn.js';

export const verifyToken = (token) => {
  const secretKey = env('JWT_SECRET');

  try {
    return jwt.verify(token, secretKey);
  } catch (error) {
    console.log(error);
    return null;
  }
};
