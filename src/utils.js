/* eslint-disable no-process-env */

import expressWinston from 'express-winston';
import winston from 'winston';
import moment from 'moment';
import ApiError from './error';

const logger = createLogger();

export function readEnvironmentVariable(name, {defaultValue = undefined, hideDefault = false, format = v => v} = {}) {
  if (process.env[name] === undefined) {
    if (defaultValue === undefined) { // eslint-disable-line functional/no-conditional-statement
      throw new Error(`Mandatory environment variable missing: ${name}`);
    }

    const defaultValuePrintable = typeof defaultValue === 'object' ? JSON.stringify(defaultValue) : defaultValue;

    logger.log('error', `No environment variable set for ${name}, using default value: ${hideDefault ? '[hidden]' : defaultValuePrintable}`);
    return defaultValue;
  }

  return format(process.env[name]);
}

export function createLogger(options = {}) {
  return winston.createLogger({...createLoggerOptions(), ...options});
}

export function createExpressLogger(options = {}) {
  return expressWinston.logger({
    meta: true,
    msg: '{{req.ip}} HTTP {{req.method}} {{req.path}} - {{res.statusCode}} {{res.responseTime}}ms',
    ignoreRoute: () => false,
    ...createLoggerOptions(),
    ...options
  });
}

function createLoggerOptions() {
  // Log Levels: error, warn, info, http, verbose, debug, silly
  const logLevel = process.env.LOG_LEVEL || 'verbose';
  const debuggingEnabled = logLevel === 'debug';
  const timestamp = winston.format(info => ({...info, timestamp: moment().format()}));

  return {
    format: winston.format.combine(timestamp(), winston.format.printf(formatMessage)),
    transports: [
      new winston.transports.Console({
        level: logLevel,
        silent: process.env.NODE_ENV === 'test' && !debuggingEnabled
      })
    ]
  };

  function formatMessage(i) {
    return `${i.timestamp} - ${i.level}: ${i.message}`;
  }
}

export function logError(err) {
  if (err instanceof ApiError) {
    logger.log('error', JSON.stringify(err));
    return;
  }

  if (err === 'SIGINT') {
    logger.log('error', err);
    return;
  }

  logger.log('error', err.stack === undefined ? err : err.stack);
}
