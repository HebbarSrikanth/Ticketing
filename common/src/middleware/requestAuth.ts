import { Request, Response, NextFunction } from 'express';
import { NotAuthenticatedError } from '../error/notAuth';

export const requestAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.currentUser) {
    throw new NotAuthenticatedError();
  }

  next();
};
