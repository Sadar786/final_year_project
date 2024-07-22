import express from 'express'
const UserRouter = express.Router();
import { test, updateUser, deleteUser, signOut, getUsers, getUser } from '../controllers/user.controller.js';
import { verifyUser } from '../utils/verifyUser.js';


UserRouter.get('/test',test)
UserRouter.put('/update/:userId', verifyUser,   updateUser)
UserRouter.delete('/deleteUser/:userId', verifyUser,   deleteUser)
UserRouter.post('/signout',    signOut)
UserRouter.get('/getUsers', verifyUser, getUsers)
UserRouter.get("/getUser/:userId", getUser)


export default UserRouter;