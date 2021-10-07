import { ValidationError } from 'express-validator';
import { CustomError } from './customError';

export class RequestValidationError extends CustomError {
  statusCode = 400;
  constructor(public errors: ValidationError[]) {
    super('Invalid details !!');
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeError() {
    return this.errors.map((e) => {
      return {
        message: e.msg,
        field: e.param,
      };
    });
  }
}
