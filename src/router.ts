import path from 'path';
import { Router } from 'express';
import multer from 'multer';

import { createCategory } from './useCase/categories/createCategory';
import { listCategory } from './useCase/categories/listCategories';
import { createProduct } from './useCase/Products/createProduct';
import { listProducts } from './useCase/Products/listProducts';
import { listProductsByCategory } from './useCase/categories/listProductsByCategory';
import { listOrders } from './useCase/Orders/listOrders';
import { createOrder } from './useCase/Orders/createOrder';
import { changeOrderStatus } from './useCase/Orders/ChangeOrderStatus';
import { cancelOrder } from './useCase/Orders/CancelOrder';
import { createUser } from './useCase/Users/createUser';
import { listUsers } from './useCase/Users/listUsers';

export const router = Router();

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, callback) {
      callback(null, path.resolve(__dirname, '..', 'uploads'));
    },
    filename(req, file, callback) {
      // Padrão de nomeação de arquivos armazenados
      callback(null, `${Date.now()}-${file.originalname}`);
    }
  })
});


// List categories
router.get('/categories', listCategory);

// Create category
router.post('/categories', createCategory);

// List products
router.get('/products', listProducts);

// Create product
router.post('/products', upload.single('image'), createProduct);

// Get product by category
router.get('/categories/:categoryId/products', listProductsByCategory);

// List orders
router.get('/orders', listOrders);

// Create order
router.post('/orders', createOrder);

// Change order status
router.patch('/orders/:orderId', changeOrderStatus);

// Delete/cancel order
router.delete('/orders/:orderId', cancelOrder);

router.post('/users', createUser);
router.get('/users', listUsers);
