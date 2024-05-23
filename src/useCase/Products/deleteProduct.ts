import { unlink } from 'node:fs';
import path from 'path';
import { Request, Response } from 'express';
import { Product } from '../../models/Product';

export async function deleteProduct(req: Request, res: Response) {
  const { id } = req.params;

  try {
    const product = await Product.findByIdAndDelete(id);

    if (product) {
      unlink(path.resolve(__dirname, '..', '..', '..', 'uploads', `${product.imagePath}`), (err) => {
        if (err) {
          if (err.code === 'ENOENT') {
            console.log('Image not found');
            return;
          }

          console.error('Error when deleting file:', err);
          return;
        }
        console.log(`${product.imagePath} was deleted`);
      });
    }

    return res.sendStatus(204);
  } catch(err) {
    console.error(err);
    return res.sendStatus(500);
  }
}
