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
import { listCurrentUserOrders } from './useCase/Orders/listCurrentUserOrders';
import { updateCategory } from './useCase/categories/updateCategory';
import { deleteCategory } from './useCase/categories/deleteCategory';
import { deleteProduct } from './useCase/Products/deleteProduct';
import { updateProduct } from './useCase/Products/updateProduct';

export const router = Router();

const roles = {
  admin: 'ADMIN',
  waiter: 'WAITER'
};

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

router.get('/categories', authorization([roles.admin, roles.waiter]), listCategory);
router.post('/categories', authorization([roles.admin]), createCategory);
router.put('/categories/:id', authorization([roles.admin]), updateCategory);
router.delete('/categories/:id', authorization([roles.admin]), deleteCategory);

router.get('/products', authorization([roles.admin, roles.waiter]), listProducts);
router.post('/products', authorization([roles.admin]), upload.single('image'), createProduct);
router.get('/categories/:categoryId/products', authorization([roles.admin, roles.waiter]), listProductsByCategory);
router.delete('/products/:id', authorization([roles.admin]), deleteProduct);
router.put('/products/:id', authorization([roles.admin]), upload.single('image'), updateProduct);

router.get('/orders', authorization([roles.admin]), listOrders);
router.get('/orders/my', authorization([roles.admin, roles.waiter]), listCurrentUserOrders);
router.post('/orders', authorization([roles.admin, roles.waiter]), createOrder);
router.patch('/orders/:orderId', authorization([roles.admin]), changeOrderStatus);
router.delete('/orders/:orderId', authorization([roles.admin]), cancelOrder);

router.post('/users', authorization([roles.admin]), createUser);
router.get('/users', authorization([roles.admin]), listUsers);
router.get('/users/me', authorization([roles.admin, roles.waiter]), me);
router.get('/users/:id', authorization([roles.admin, roles.waiter]), showUser);
router.put('/users/:id', authorization([roles.admin, roles.waiter]), updateUser);
router.delete('/users/:id', authorization([roles.admin]), deleteUser);
