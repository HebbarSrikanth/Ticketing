import express, { Request, Response } from 'express';
import { currentUser } from '../middleware/currentUser';

const router = express.Router();

router.get('/api/users/currentuser', currentUser, (req: Request, res: Response) => {
  console.log(`${req.method} - ${req.url} Current user details Service!!`);

  //currentUser middleware will check if the cookies has token
  //Then will assign into the req object which is then sent back to user
  res.send({ currentUser: req.currentUser || null });
});

export { router as currentUser };
