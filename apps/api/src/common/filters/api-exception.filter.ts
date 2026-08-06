import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { resolveRequestId } from '../http/request-id';

type ErrorPayload = {
  readonly error?: string;
  readonly message?: string | string[];
  readonly statusCode?: number;
};

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const httpContext = host.switchToHttp();
    const request = httpContext.getRequest<Request>();
    const response = httpContext.getResponse<Response>();
    const requestId = resolveRequestId(request, response);
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
      requestId,
      error,
      errorMessage,
    });
  }
}
