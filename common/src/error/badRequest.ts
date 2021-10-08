import { CustomError } from './customError';

export class BadRequest extends CustomError {
  statusCode = 400;

  constructor(public msg: string) {
    super(msg);
    Object.setPrototypeOf(this, BadRequest.prototype);
  }

  serializeError() {
    return [
      {
        message: this.msg,
      },
    ];
  }
}
