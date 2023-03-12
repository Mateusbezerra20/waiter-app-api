import { Request, Response } from 'express';
import { Order } from '../../models/Order';

export async function listOrders( req: Request, res: Response ) {
  try {

    // Busque os pedidos ordenando do mais antigo para o mais recente
    // Trazendo também os dados dos produtos.
    const orders = await Order.find()
      .sort({ createdAt: 1 })
      .populate('products.product');

    res.json(orders);

  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}
