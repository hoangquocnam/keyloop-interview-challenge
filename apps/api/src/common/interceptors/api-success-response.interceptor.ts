import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { resolveRequestId } from '../http/request-id';

@Injectable()
export class ApiSuccessResponseInterceptor<T> implements NestInterceptor<
  T,
  unknown
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<unknown> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest<Request>();
    const response = httpContext.getResponse<Response>();
    const requestId = resolveRequestId(request, response);

    return next.handle().pipe(
      map((data) => ({
        success: true,
        statusCode: String(response.statusCode),
        requestId,
        data,
      })),
    );
  }
}
