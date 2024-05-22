import { Request, Response } from 'express';
import { User } from '../../models/User';

export async function listUsers(req: Request, resp: Response) {
  try {
    const users = await User.find();

    return resp.status(200).json(users);
  } catch (err) {
    console.error(err);
    return resp.sendStatus(500);
  }
}
