import { Request, Response } from 'express';
import { User } from '../../models/User';

export async function showUser(req: Request, resp: Response) {
  const { id } = req.params;

  try {
    const user = await User.findById(id, ['id', 'name', 'email', 'role']);

    return resp.status(200).json(user);
  } catch (err) {
    console.error(err);
    return resp.sendStatus(500);
  }
}
