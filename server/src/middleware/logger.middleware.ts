import morgan from 'morgan';

export const httpLogger = morgan(
  process.env.NODE_ENV === 'production' ? 'combined' : 'dev'
);
