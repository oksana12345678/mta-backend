import { Router } from 'express';
import authRouter from './auth.js';
import productsRouter from './products.js';

const routers = Router();

routers.use('/products', productsRouter);

routers.use('/auth', authRouter);

export default routers;
