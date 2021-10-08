import { Response, Request, NextFunction } from 'express';
import { CustomError } from '../error/customError';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).send({ errors: err.serializeError() });
  }
  return res.status(400).send({
    errors: [{ message: 'Something went wrong' }],
  });
};
