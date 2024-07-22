// product.routes.js

import express from 'express';
import { verifyUser } from '../utils/verifyUser.js';
import { createProduct, getProducts, getMyProducts, deleteProduct, deleteProductsByShopId} from '../controllers/products.controller.js';


const ProductsRouter = express.Router();

ProductsRouter.post('/createProduct', verifyUser, createProduct);
ProductsRouter.get('/getProducts', getProducts);
ProductsRouter.get('/getMyProducts/:shopId',verifyUser, getMyProducts );
ProductsRouter.delete('/deleteProduct/:productId/:userId/:shopId',verifyUser, deleteProduct);
ProductsRouter.delete('/deleteProductsByShopId/:shopId', verifyUser, deleteProductsByShopId);

export default ProductsRouter;
