import { Request, Response } from 'express';
import { unlink } from 'fs';
import path from 'path';
import { Product } from '../../models/Product';

export async function updateProduct(req: Request, res: Response) {
  const { id } = req.params;
  const imagePath = req.file?.filename;
  const { name, description, price, category, ingredients} = req.body;

  try {
    const prevProduct = await Product.findByIdAndUpdate(id, {
      name,
      description,
      price,
      category,
      ingredients,
      imagePath
    });

    if (prevProduct && imagePath) {
      unlink(path.resolve(__dirname, '..', '..', '..', 'uploads', `${prevProduct.imagePath}`), (err) => {
        if (err) {
          if (err.code === 'ENOENT') {
            console.log('updateProduct: Prev image not found');
            return;
          }

          console.error('Error when deleting image:', err);
          return;
        }

        console.log(`${prevProduct.imagePath} was deleted`);
      });
    }

    return res.sendStatus(204);
  } catch(err) {
    console.error('Error when updating product:', err);
    return res.sendStatus(500);
  }
}
