//
// mdn-bcd-collector: lib/logger.ts
// Logging output module to log to either the console or GAE cloud
//
// © Gooborg Studios, Google LLC
// See the LICENSE file for copyright details
//

import winston from 'winston';
import { LoggingWinston } from '@google-cloud/logging-winston';

type LogTransport =
  | LoggingWinston
  | winston.transports.ConsoleTransportInstance;

/**
 * Get a winston logging transport.
 * @returns {LogTransport} winston logging transport
 */
const getTransport = (): LogTransport => {
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
