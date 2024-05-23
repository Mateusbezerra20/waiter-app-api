import { Request, Response } from 'express';
import { Category } from '../../models/Category';

export async function deleteCategory(req: Request, resp: Response) {
  const { id } = req.params;

  try {
    await Category.findByIdAndDelete(id);

    resp.sendStatus(204);
  } catch(err) {
    console.log(err);
    resp.sendStatus(500);
  }
}
