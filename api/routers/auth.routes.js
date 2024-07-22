import express from 'express'
import  {signUp, signin, googleAuth}  from '../controllers/auth.controller.js';
const AuthRouter = express.Router();

AuthRouter.post("/signup", signUp)
AuthRouter.post("/signin", signin)
AuthRouter.post("/googleAuth", googleAuth)
// AuthRouter.post("/googleAuth", googleAuth)


export default AuthRouter;