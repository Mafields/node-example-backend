import {Router} from 'express';
import fs from 'fs';
import path from 'path';
import HttpError from '../error';
import {createLogger} from '../utils';

export default () => {
  const logger = createLogger();
  const apiDoc = fs.readFileSync(path.join(__dirname, '..', 'apiDoc.json'), 'utf8');

  return new Router().get('', getApiDoc);

  function getApiDoc(req, res, next) {
    logger.log('http', 'Routes/get/getApiDoc');
    try {
      res.set('Content-Type', 'application/json').send(apiDoc);
    } catch (error) {
      if (error instanceof HttpError) {
        return res.status(error.status).send(error.message);
      }

      return next();
    }
  }
};
