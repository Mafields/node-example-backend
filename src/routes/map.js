import {Router} from 'express';
import httpStatus from 'http-status';
import createMapService from '../interfaces/map';
import HttpError from '../error';
import {createLogger} from '../utils';

export default async ({mongoUri}) => {
  const logger = createLogger();
  const mapService = await createMapService({mongoUri});

  return new Router().get('/', getMap);

  async function getMap(req, res, next) {
    logger.log('http', 'Routes/get/getMap');
    try {
      const params = req.query;
      const result = await mapService.get(params);
      res.status(httpStatus.OK).send(result);
    } catch (error) {
      if (error instanceof HttpError) {
        return res.status(error.status).send(error.message);
      }
      return next();
    }
  }
};
