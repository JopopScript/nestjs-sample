import {
  ArgumentsHost, BadGatewayException, Catch, ExceptionFilter, HttpException, HttpStatus, Logger
} from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { CustomError } from './custom.error';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}
  catch(exception: ValidationError[] | HttpException | CustomError | Error, host: ArgumentsHost) {
    Logger.debug(`AllExceptionsFilter call`);
    if (this.isValidationErrors(exception)) {
      exception.forEach(e => {
        Logger.debug(`exception.constructor: `, JSON.stringify(e.constructor.name));
        Logger.debug(`exception: `, JSON.stringify(exception));
      });
    } else {
      Logger.debug(`exception.constructor: `, JSON.stringify(exception.constructor.name));
      Logger.debug(`exception.message: `, JSON.stringify(exception.message));
      Logger.debug(`exception?.stack: `, JSON.stringify(exception?.stack));
    }

    const { status, message } = this.makeErrorResponse(exception);   
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()
    response.status(status).json({ message })
  }

  private isValidationErrors(exception: ValidationError[] | HttpException | CustomError | Error): exception is ValidationError[] {
    if (Array.isArray(exception) && exception.every(e => e instanceof ValidationError)) {
      return true
    }
    return false
  }

  private makeErrorResponse(exception: ValidationError[] | HttpException | CustomError | Error): { status: number, message: string} {
    if (this.isValidationErrors(exception)) {
      return { status: 404, message: 'Bad Request Exception' }
      BadGatewayException
    } else if (exception instanceof HttpException) {
      return { status: exception.getStatus(), message: exception.message }
    } else if (exception instanceof CustomError) {
      const message = exception?.describe ? exception.describe : '알수없는 오류가 발생했습니다.';
      return { status: HttpStatus.INTERNAL_SERVER_ERROR, message }
    } else {
      return { status: HttpStatus.INTERNAL_SERVER_ERROR, message: '알수없는 오류가 발생했습니다.' }
    }
  }
}
