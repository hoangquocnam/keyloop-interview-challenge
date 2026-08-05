import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { Response } from 'express';

type ErrorPayload = {
  readonly error?: string;
  readonly message?: string | string[];
  readonly statusCode?: number;
};

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();
    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const payload =
      exception instanceof HttpException ? exception.getResponse() : undefined;
    const exceptionName =
      exception instanceof Error ? exception.name : 'InternalServerError';

    const normalizedPayload =
      typeof payload === 'string'
        ? { error: exceptionName, message: payload }
        : (payload as ErrorPayload | undefined);

    const errorMessage = Array.isArray(normalizedPayload?.message)
      ? normalizedPayload.message.join(', ')
      : (normalizedPayload?.message ??
        (exception instanceof Error
          ? exception.message
          : 'Internal server error.'));

    const error =
      normalizedPayload?.error ??
      (exception instanceof HttpException
        ? HttpStatus[statusCode]
        : 'InternalServerError');

    response.status(statusCode).json({
      success: false,
      statusCode: String(statusCode),
      error,
      errorMessage,
    });
  }
}
