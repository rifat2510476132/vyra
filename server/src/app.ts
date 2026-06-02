import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import v1Routes from './routes/v1';
import { httpLogger } from './middleware/logger.middleware';
import { apiLimiter } from './middleware/rateLimiter.middleware';
import { initCloudinary } from './utils/cloudinary.util';
import { initFirebase } from './utils/fcm.util';
import { corsOriginCallback } from './utils/cors.util';

dotenv.config();
initCloudinary();
initFirebase();

const app = express();

app.use(
  helmet({
    contentSecurityPolicy: process.env.WEB_ROOT ? false : undefined,
  })
);
app.use(
  cors({
    origin: corsOriginCallback,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(httpLogger);
app.use(express.json({ limit: '10mb' }));
app.use(apiLimiter);
app.use('/api/v1', v1Routes);

app.get('/api/v1/health', (_req, res) => {
  res.json({ ok: true, service: 'vyra-api', version: '1.0.0' });
});

const webRoot = process.env.WEB_ROOT;
if (webRoot && fs.existsSync(webRoot)) {
  app.use(express.static(webRoot));
  app.get(/^(?!\/api\/).*/, (_req, res) => {
    res.sendFile(path.join(webRoot, 'index.html'));
  });
} else {
  app.get('/', (_req, res) => {
    res.json({
      name: 'VYRA API',
      tagline: 'The Social Universe of 2125',
      version: '1.0.0',
      hint: 'Set WEB_ROOT to serve Flutter web build',
    });
  });
}

export default app;
