import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import env from './config/env.js';
import routes from './routes/index.js';
import { errorHandler, notFound } from './middlewares/error.js';

const app = express();

app.disable('x-powered-by');
app.set('trust proxy', 1);

app.use(helmet());
app.use(
  cors({
    origin: env.corsOrigin.includes('*') ? true : env.corsOrigin,
    credentials: true,
  }),
);
app.use(compression());
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: false }));

if (env.nodeEnv !== 'test') {
  app.use(morgan(env.isProduction ? 'combined' : 'dev'));
}

app.use('/api', routes);
app.use(notFound);
app.use(errorHandler);

export default app;
