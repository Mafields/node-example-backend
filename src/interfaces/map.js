import {createLogger, logError} from '../utils';
import ApiError from '../error';
import httpStatus from 'http-status';
import mongoFactory from './mondoDb';

export default async function ({mongoUri}) {
  const logger = createLogger();
  const mongoOperator = await mongoFactory({mongoUri});

  return {get};

  async function get(params) {
    try {
      logger.log('verbose', 'Interfaces/map/get');
      if (params.id === undefined) { // eslint-disable-line functional/no-conditional-statement
        throw new ApiError(httpStatus.BAD_REQUEST, 'Query param id missing');
      }
      const data = await mongoOperator.getOne({id: params.id});
      return data;
    } catch (error) {
      logError(error);
      throw error;
    }
  }
}
