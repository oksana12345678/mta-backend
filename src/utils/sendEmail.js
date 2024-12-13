import nodemailer from 'nodemailer';
import env from './evn.js';
import { SMTP } from '../constants/index.js';

const transporter = nodemailer.createTransport({
  host: env(SMTP.SMTP_HOST),
  port: Number(env(SMTP.SMTP_PORT)),
  auth: {
    user: env(SMTP.SMTP_USER),
    pass: env(SMTP.SMTP_PASSWORD),
  },
  secure: false,
});

export const sendEmail = async (options) => {
  return await transporter.sendMail(options);
};
