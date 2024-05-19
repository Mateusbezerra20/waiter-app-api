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
import { authorization } from './middlewares/authorization';
import { me } from './useCase/Users/me';

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

router.get('/categories', authorization(['ADMIN', 'WAITER']), listCategory);
router.post('/categories', authorization(['ADMIN']), createCategory);

router.get('/products', authorization(['ADMIN', 'WAITER']), listProducts);
router.post('/products', authorization(['ADMIN']), upload.single('image'), createProduct);
router.get('/categories/:categoryId/products', authorization(['ADMIN', 'WAITER']), listProductsByCategory);

router.get('/orders', authorization(['ADMIN']), listOrders);
router.post('/orders', authorization(['ADMIN', 'WAITER']), createOrder);
router.patch('/orders/:orderId', authorization(['ADMIN']), changeOrderStatus);
router.delete('/orders/:orderId', authorization(['ADMIN']), cancelOrder);

router.post('/users', authorization(['ADMIN']), createUser);
router.get('/users', authorization(['ADMIN']), listUsers);
router.get('/users/me', authorization(['ADMIN', 'WAITER']), me);
router.get('/users/:id', authorization(['ADMIN', 'WAITER']), showUser);
router.put('/users/:id', authorization(['ADMIN', 'WAITER']), updateUser);
router.delete('/users/:id', authorization(['ADMIN']), deleteUser);
