import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { User } from '../models/user';
import { userRequestValidation, BadRequest } from '@hebbar_ticketing/common';

import jwt from 'jsonwebtoken';
import 'express-async-errors';

const router = express.Router();

router.post(
  '/api/users/signup',
  [
    body('email').isEmail().withMessage('Please provide a proper email address'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password should be between 4-20 characters'),
  ],
  userRequestValidation,
  async (req: Request, res: Response) => {
    console.log(`${req.method} - ${req.url} Signup Service!!`);

    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequest('Email already in use!!');
    }

    const newUser = User.build({ email, password });
    await newUser.save();

    const secretKeyValue = process.env.JWT_KEY!;

    //We need to create a jwt token and set it to cookie
    const jwtToken = jwt.sign({ email: newUser.email, id: newUser._id }, secretKeyValue);

    req.session = {
      jwt: jwtToken,
    };

    return res.status(201).send(newUser);
  }
);

export { router as signupRouter };
