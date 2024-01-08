import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiResponse } from '../common.dto';

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    const errors = this.flattenValidationErrors(
      exception.getResponse()['message'],
    );

    response
      .status(status)
      .json(new ApiResponse(null, 'Validation failed', status, errors));
  }

  private flattenValidationErrors(validationErrors: any[]): any {
    const errors = [];

    for (const error of validationErrors) {
      for (const constraint in error.constraints) {
        errors.push({
          field: error.property,
          message: error.constraints[constraint],
        });
      }
    }

    return errors;
  }
}
