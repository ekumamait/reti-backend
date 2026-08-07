import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { returnResponse } from '../response.util';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = this.extractMessage(exception, status);

    response.status(status).json(returnResponse(status, message, null));
  }

  private extractMessage(exception: unknown, status: number): string {
    if (exception instanceof HttpException) {
      const body = exception.getResponse();
      if (typeof body === 'string') {
        return body;
      }
      const bodyMessage = (body as { message?: string | string[] }).message;
      if (Array.isArray(bodyMessage)) {
        return bodyMessage.join('; ');
      }
      if (typeof bodyMessage === 'string') {
        return bodyMessage;
      }
      return exception.message;
    }

    console.error(exception);
    return status === HttpStatus.INTERNAL_SERVER_ERROR
      ? 'Oops! The problem is not on your side. Hang on, we will fix this soon'
      : 'An unexpected error occurred';
  }
}
