import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import dotenv from 'dotenv';
import env from './utils/evn.js';
import routers from './routers/index.js';
import notFoundHandler from './middlewares/notFoundHandler.js';
import errorHandler from './middlewares/errorHandler.js';
import cookieParser from 'cookie-parser';
import { UPLOAD_DIR } from './constants/index.js';
import { swaggerDocs } from './middlewares/swaggerDocs.js';

dotenv.config();

const PORT = Number(env('PORT', '3000'));

const setupServer = () => {
  const app = express();

  app.use(cookieParser());

  const allowedOrigins = [
    'https://n5xf4lmx-5174.euw.devtunnels.ms',
    'https://phone-book-kohl.vercel.app',
    'http://localhost:5173',
  ];

  const corsOptions = {
    origin: function (origin, callback) {
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  };
  app.use(cors(corsOptions));

  app.options('*', cors(corsOptions));

  app.use((req, res, next) => {
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization',
    );
    next();
  });

  app.use(express.json());

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.use((req, res, next) => {
    console.log(`Time: ${new Date().toLocaleString()}`);
    next();
  });

  app.use('/api-docs', swaggerDocs());

  app.use('/uploads', express.static(UPLOAD_DIR));

  app.use(routers);

  app.use('*', notFoundHandler);

  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
export default setupServer;
