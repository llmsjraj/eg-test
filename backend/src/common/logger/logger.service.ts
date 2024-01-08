import { Injectable, LoggerService, Scope } from '@nestjs/common';
import * as winston from 'winston';

@Injectable({ scope: Scope.TRANSIENT })
export class MyLoggerService implements LoggerService {
  private logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: 'info', // Or read from configuration
      format: winston.format.json(),
      transports: [
        new winston.transports.Console(),
        // Add file or external service transports here
      ],
    });
  }

  log(message: string) {
    this.logger.info(message);
  }

  error(message: string, trace: string) {
    this.logger.error(message, { trace });
  }

  warn(message: string) {
    this.logger.warn(message);
  }

  debug(message: string) {
    this.logger.debug(message);
  }

  verbose(message: string) {
    this.logger.verbose(message);
  }
}
