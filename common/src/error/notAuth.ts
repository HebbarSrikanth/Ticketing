import { CustomError } from './customError';

export class NotAuthenticatedError extends CustomError {
  statusCode = 401;

  constructor() {
    super('User not Authorized!!');
    Object.setPrototypeOf(this, NotAuthenticatedError.prototype);
  }

  serializeError() {
    return [
      {
        message: 'User not Authorized!!',
      },
    ];
  }
}
