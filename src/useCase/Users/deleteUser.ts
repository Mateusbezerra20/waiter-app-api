import { Request, Response } from 'express';
import { User } from '../../models/User';

export async function deleteUser(req: Request, resp: Response) {
  const { id } = req.params;

  try {
    await User.findByIdAndDelete(id);

    return resp.sendStatus(200);
  } catch (err) {
    console.error(err);
    return resp.sendStatus(500);
  }
}
