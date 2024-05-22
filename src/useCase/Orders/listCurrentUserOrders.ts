import { Request, Response } from 'express';
import { Order } from '../../models/Order';

export async function listCurrentUserOrders(req: Request, resp: Response) {
  const { id: userId } = req.loggedUser;

  try {
    const orders = await Order.find().where('user').equals(userId);

    return resp.status(200).json(orders);
  } catch(err) {
    console.error(err);
    return resp.sendStatus(500);
  }
}
