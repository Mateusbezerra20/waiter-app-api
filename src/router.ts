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
import { login } from './useCase/Authentication/login';
import { authenticate } from './middlewares/authenticate';
import { updateUser } from './useCase/Users/updateUser';
import { deleteUser } from './useCase/Users/deleteUser';
import { showUser } from './useCase/Users/showUser';

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


router.post('/login', login);

router.use(authenticate);

router.get('/categories', listCategory);
router.post('/categories', createCategory);

router.get('/products', listProducts);
router.post('/products', upload.single('image'), createProduct);
router.get('/categories/:categoryId/products', listProductsByCategory);

router.get('/orders', listOrders);
router.post('/orders', createOrder);
router.patch('/orders/:orderId', changeOrderStatus);
router.delete('/orders/:orderId', cancelOrder);

router.post('/users', createUser);
router.get('/users', listUsers);
router.get('/users/:id', showUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
