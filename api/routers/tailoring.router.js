import express from 'express'
import { verifyUser } from '../utils/verifyUser.js'
const tailoringtRouter = express.Router();
import { createTailoring,tailoringFinanceReport, getMyTailorings, getTailorings, deleteTailoring, updateTailoring, /*addProductToShop*/ } from '../controllers/tailoring.controller.js'
const app = express();


tailoringtRouter.post('/createTailoring', verifyUser, createTailoring)
tailoringtRouter.get('/getTailoring', getTailorings)
tailoringtRouter.get('/getMyTailorings/:shopId', verifyUser, getMyTailorings)
tailoringtRouter.get('/monthlyReport/:shopId', verifyUser, tailoringFinanceReport)
tailoringtRouter.delete('/deleteTailoring/:tailoringId/:userId', verifyUser, deleteTailoring);
tailoringtRouter.put('/updateTailoring/:tailoringId/:userId', verifyUser, updateTailoring)
// tailoringtRouter.post('/addProductToShop/:shopId/:productId', addProductToShop );

export default tailoringtRouter;