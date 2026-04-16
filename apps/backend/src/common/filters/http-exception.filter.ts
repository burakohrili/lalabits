import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('ExceptionFilter');

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException
        ? exception.getResponse()
        : null;

    const code =
      typeof exceptionResponse === 'string'
        ? exceptionResponse
        : ((exceptionResponse as Record<string, unknown>)?.message as string) ??
          'INTERNAL_ERROR';

    // Log unhandled (non-HTTP) exceptions — these are bugs
    if (!(exception instanceof HttpException)) {
      this.logger.error(
        `Unhandled exception on ${request.method} ${request.url}: ${(exception as Error)?.message ?? exception}`,
        (exception as Error)?.stack,
      );
    }

    response.status(status).json({
      statusCode: status,
      code,
      message: typeof code === 'string' ? code : 'Internal server error',
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
