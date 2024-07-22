// product.routes.js

import express from 'express';
import { verifyUser } from '../utils/verifyUser.js';
import { createOrder, getOrders, getMyOrders, deleteOrder, updateOrder} from '../controllers/order.controller.js';


const OrderRouter = express.Router();

OrderRouter.post('/createOrder', verifyUser, createOrder);
OrderRouter.get('/getOrders', getOrders);
OrderRouter.get('/getMyOrders/:shopId',verifyUser, getMyOrders );
OrderRouter.delete('/deleteOrder/:orderId/:userId/:shopId',verifyUser, deleteOrder);
OrderRouter.delete('/deleteOrder/:orderId/:userId',verifyUser, deleteOrder);
OrderRouter.post('/updateOrder/:orderId/:userId/:shopId',verifyUser,updateOrder );
// OrderRouter.delete('/deleteOrdersByShopId/:shopId', verifyUser, deleteOrdersByShopId);

export default OrderRouter;
