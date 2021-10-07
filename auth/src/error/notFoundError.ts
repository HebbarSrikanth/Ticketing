import { CustomError } from './customError';

export class NotFoundError extends CustomError {
  statusCode = 404;

  constructor(public url: string) {
    super('API route was nout found');

    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeError() {
    return [{ message: this.url }];
  }
}
