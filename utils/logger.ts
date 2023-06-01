/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import winston from 'winston';
import { LoggingWinston } from '@google-cloud/logging-winston';

const getTransport = () => {
  /* c8 ignore next 3 */
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    return new LoggingWinston();
  }

  return new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple(),
    ),
  });
};

const logger = winston.createLogger({
  level: 'info',
  transports: [getTransport()],
  silent: process.env.NODE_ENV === 'test',
});

export default logger;
