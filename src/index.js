import {logError} from './utils';
import * as config from './config';
import startApp from './app';

run();

async function run() {
  registerInterruptionHandlers();

  await startApp(config);

  function registerInterruptionHandlers() {
    process.on('SIGTERM', handleSignal);
    process.on('SIGINT', ({stack}) => handleTermination({message: stack}));
    process.on('uncaughtException', ({stack}) => handleTermination({message: stack}));
    process.on('unhandledRejection', ({stack}) => handleTermination({message: stack}));

    function handleSignal(signal) {
      handleTermination({message: `Received ${signal}`});
    }
  }

  function handleTermination({code = 1, message = false}) {
    logMessage(message);

    process.exit(code); // eslint-disable-line no-process-exit

    function logMessage(message) {
      if (message) {
        return logError(message);
      }
    }
  }
}
