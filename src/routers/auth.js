import express from 'express';
import validateBody from '../middlewares/validateBody.js';
import {
  loginUserSchema,
  registerUserSchema,
  requestResetEmailSchema,
  resetPasswordSchema,
} from '../validation/auth.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import {
  loginUserController,
  logoutUserController,
  refreshUserSessionController,
  registerUserController,
  requestResetEmailController,
  resetPasswordController,
} from '../controllers/auth.js';
import { authenticate } from '../middlewares/authenticate.js';

const routerAuth = express.Router();
const parseJSON = express.json();

routerAuth.post(
  '/register',
  parseJSON,
  validateBody(registerUserSchema),
  ctrlWrapper(registerUserController),
);

routerAuth.post(
  '/login',
  parseJSON,
  validateBody(loginUserSchema),
  ctrlWrapper(loginUserController),
);

routerAuth.post('/logout', parseJSON, ctrlWrapper(logoutUserController));

routerAuth.post(
  '/send-reset-email',
  validateBody(requestResetEmailSchema),
  ctrlWrapper(requestResetEmailController),
);

routerAuth.post(
  '/reset-pwd',
  validateBody(resetPasswordSchema),
  ctrlWrapper(resetPasswordController),
);

routerAuth.use(authenticate);

routerAuth.post(
  '/current',
  parseJSON,
  ctrlWrapper(refreshUserSessionController),
);

export default routerAuth;
