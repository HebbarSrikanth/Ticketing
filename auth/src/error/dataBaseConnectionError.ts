import { CustomError } from './customError';

export class DataBaseError extends CustomError {
  statusCode = 500;
  reason = 'Error while connecting to DB';
  constructor() {
    super('Errow while connecting to Db');
    Object.setPrototypeOf(this, DataBaseError.prototype);
  }
  serializeError() {
    return [
      {
        message: this.reason,
      },
    ];
  }
}
