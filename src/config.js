import {readEnvironmentVariable} from './utils';

// Util envs
export const httpPort = readEnvironmentVariable('HTTP_PORT', {defaultValue: '8080'});
export const mongoUrl = readEnvironmentVariable('MONGO_URL', {defaultValue: 'mongodb://127.0.0.1:27017/db'});
export const mapLevel = readEnvironmentVariable('MAP_LEVEL', {defaultValue: 1});
