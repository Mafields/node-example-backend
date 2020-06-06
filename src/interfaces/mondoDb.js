// Connecting to mongoDB and saving / loading data
// https://github.com/NatLibFi/melinda-rest-api-commons/blob/dev/src/mongo.js
import {createLogger} from '../utils';
import {promisify} from 'util';

export default async function ({mongoUri}) {
  const setTimeoutPromise = promisify(setTimeout);
  const logger = createLogger();
  logger.log('info', 'Creating mongo interface');
  // Example const client = await MongoClient.connect(mongoUrl, {useNewUrlParser: true, useUnifiedTopology: true});
  // Example const db = client.db('map');
  await setTimeoutPromise(1000); // Simulates connection time
  logger.log('verbose', `Connection to mongo has been enstabilished to ${mongoUri}`);

  return {getOne};

  async function getOne({id}) {
    logger.log('http', 'Interfaces/mongoDb/getOne');
    await setTimeoutPromise(1000); // Simulates query time
    return {data: id};
  }
}
