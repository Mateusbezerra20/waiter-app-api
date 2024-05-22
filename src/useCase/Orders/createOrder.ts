import { Request, Response} from 'express';
import { Order } from '../../models/Order';

import { io } from '../../';

export async function createOrder( req: Request, res: Response ) {
  try {
    const { table, user, products } = req.body;

    if(!table) {
      return res.status(400).json({
        error: 'table is required'
      });
    }

    const order = await Order.create({table, user, products});
    const orderDetails = await order.populate('products.product');

    // Avisar ao client quando uma order for cadastrada.
    io.emit('orders@new', orderDetails);

    res.status(201).json(order);
  } catch(error) {
    console.log(error);
    res.sendStatus(500);
  }
}
