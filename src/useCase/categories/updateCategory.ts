import { Request, Response } from 'express';
import { Category } from '../../models/Category';

export async function updateCategory(req: Request, resp: Response) {
  const { id: categoryId } = req.params;
  const { name, icon } = req.body;

  if (!name || !icon) {
    return resp.status(400).json({
      message: 'the name or icon is missing.'
    });
  }

  try {
    await Category.findByIdAndUpdate(categoryId, { name, icon });

    return resp.sendStatus(204);
  } catch(err) {
    console.error(err);
    return resp.sendStatus(500);
  }
}
