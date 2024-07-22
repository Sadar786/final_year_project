import express from 'express'
import {verifyUser} from '../utils/verifyUser.js'
const postRouter = express.Router();
import {createPost, getPosts, getPost, deletePost, updatePost, addProductToShop} from '../controllers/shop.controller.js'
const app = express();


postRouter.post('/createPost', verifyUser , createPost)
postRouter.get('/getPosts',  getPosts)
postRouter.get('/getPost/:userId',verifyUser, getPost)
postRouter.delete('/deletePost/:shopId/:userId', verifyUser, deletePost)
postRouter.put('/updatepost/:shopId/:userId', verifyUser, updatePost)
postRouter.post('/addProductToShop/:shopId/:productId', addProductToShop );

export default postRouter;