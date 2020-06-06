import bodyParser from 'body-parser';
import express from 'express';
import httpStatus from 'http-status';
import ApiError from './error';
import {logError, createLogger, createExpressLogger} from './utils';
import {createApiDocRouter, createMapRouter} from './routes';

export default async function ({
  httpPort, mongoUrl
}) {
  const logger = createLogger();
  const server = await initExpress();

  return server;

  async function initExpress() {
    const app = express();
    app.use(createExpressLogger());

    app.use(bodyParser.text({limit: '5MB', type: '*/*'})); // Incoming data parser

    app.use('/', await createApiDocRouter());
    app.use('/map', await createMapRouter({mongoUrl}));
    app.use(handleUnexpectedErrors);

    return app.listen(httpPort, () => logger.log('info', `Started Node-dep-map API in port ${httpPort}`));

    function handleUnexpectedErrors(err, req, res, next) {
      logger.log('info', 'App/handleError');
      if (err) {
        logger.log('warn', 'Responding to unexpected ERROR');
        logError(err);
        if (err instanceof ApiError) {
          return res.status(err.status).send(err.message);
        }
        return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
      }

      next();
    }
  }
}
