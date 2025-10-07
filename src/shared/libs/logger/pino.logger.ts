import { Logger as PinoInstance, pino, transport } from 'pino';
import { injectable } from 'inversify';
import { resolve } from 'node:path';
import { ILogger } from './logger.interface.js';
import { getCurrentModuleDirectoryPath } from '../../helpers/index.js';

@injectable()
export class PinoLogger implements ILogger {
  private readonly logger: PinoInstance;

  constructor() {
    const modulePath = getCurrentModuleDirectoryPath();
    const logFilePath = 'logs/rest.log';
    const destination = resolve(modulePath, '../../../', logFilePath);

    const multiTransport = transport({
      targets: [
        {
          target: 'pino/file',
          options: { destination },
          level: 'debug'
        },
        {
          target: 'pino/file',
          level: 'info',
          options: {},
        }
      ],
    });

    this.logger = pino({}, multiTransport);
    this.logger.info('Logger created…');
  }

  public debug(message: string, ..._args: unknown[]): void {
    this.logger.debug(message);
  }

  public error(message: string, error: Error, ..._args: unknown[]): void {
    this.logger.error(error, message);
  }

  public info(message: string, ..._args: unknown[]): void {
    this.logger.info(message);
  }

  public warn(message: string, ..._args: unknown[]): void {
    this.logger.warn(message);
  }
}
