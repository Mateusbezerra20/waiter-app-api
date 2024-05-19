import { Request, Response } from 'express';
import { User } from '../../models/User';

export async function me(req: Request, resp: Response) {
  try {
    const { id: userId } = req.logedUser;

    const user = await User.findById(userId);

    resp.status(200).json(user);
  } catch(err) {
    console.error('Error on fetching user data:', err);
    resp.sendStatus(500);
  }
}
