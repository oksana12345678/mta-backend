import { Router } from 'express';
import contactsRouter from './contacts.js';
import authRouter from './auth.js';

const routers = Router();

routers.use('/contacts', contactsRouter);

routers.use('/auth', authRouter);

export default routers;
