import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { userRequestValidation, BadRequest } from '@hebbar_ticketing/common';
import { User } from '../models/user';
import 'express-async-errors';
import { PasswordService } from '../util/passwordService';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post(
  '/api/users/signin',
  [
    body('email').isEmail().withMessage('Provide Proper Email'),
    body('password').trim().notEmpty().withMessage('Password should not be empty'),
  ],
  userRequestValidation,
  async (req: Request, res: Response) => {
    console.log(`${req.method} - ${req.url} Signin Service!!`);

    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      throw new BadRequest('Please sign up to create an account');
    }

    const passwordMatch = await PasswordService.toCompare(existingUser.password, password);

    if (!passwordMatch) {
      throw new BadRequest('Email/Password is invalid');
    }
    console.log('User is successfully authenticated');

    const token = jwt.sign(
      { email: existingUser.email, id: existingUser.id },
      process.env.JWT_KEY!
    );

    req.session = {
      jwt: token,
    };

    res.status(200).send(existingUser);
  }
);

export { router as signinRouter };
