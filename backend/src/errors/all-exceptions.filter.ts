import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { MongooseError } from 'mongoose';

type ResponseErrorType = {
  message: string;
  statusCode: number;
  error: string;
  timestamp: string;
  path: string;
};

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private statusCode: number;
  private response: ResponseErrorType;
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {
    this.response = {
      message: 'Internal server error',
      statusCode: 500,
      error: '',
      timestamp: new Date().toISOString(),
      path: '',
    };
  }

  catch(exception: unknown, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    this.response.path = httpAdapter.getRequestUrl(ctx.getRequest());

    if (exception instanceof HttpException) {
      this.statusCode = exception.getStatus();

      const exceptionResponse = exception.getResponse();
      this.response.error = exception.name;
      this.response.statusCode = exception.getStatus();
      if (typeof exceptionResponse === 'string') {
        this.response.message = exceptionResponse || exception.message;
      } else if ('message' in exceptionResponse) {
        this.response.message = String(exceptionResponse.message);
      }
    } else if (exception instanceof MongooseError) {
      this.response = {
        ...this.response,
        message: exception.message,
        error: exception.name,
        statusCode: 400,
      };
    }
    console.error(exception, 'debug');

    httpAdapter.reply(ctx.getResponse(), this.response, this.statusCode);
  }
}
