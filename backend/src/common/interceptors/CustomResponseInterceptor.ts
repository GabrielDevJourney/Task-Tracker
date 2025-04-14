import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiResponse } from './api-response.interface';
import { Request, Response } from 'express';

@Injectable()
export class CustomResponseInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ApiResponse<T>> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const statusCode = response.statusCode;

    return next.handle().pipe(
      map(
        (data: T) =>
          ({
            statusCode,
            message: statusCode >= 400 ? 'Error' : 'Success',
            error: statusCode >= 400 ? 'Request failed' : null,
            timestamp: Date.now(),
            version: 'v2',
            path: request.url,
            data,
          }) as ApiResponse<T>,
      ),
      catchError((err: Error | HttpException) => {
        const statusCode = err instanceof HttpException ? err.getStatus() : 500;
        const errorResponse: ApiResponse<null> = {
          statusCode,
          message: err.message || 'Internal server error',
          error: err.name || 'Error',
          timestamp: Date.now(),
          version: 'v2',
          path: request.url,
          data: null,
        };
        return throwError(() => new HttpException(errorResponse, statusCode));
      }),
    );
  }
}
