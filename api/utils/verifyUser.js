import jwt from "jsonwebtoken";
import { errorHandler } from './error.js';

export const verifyUser = (req, res, next) => {
    try {
        const token = req.cookies.access_token;
        if (!token) {
            return next(errorHandler(401, "Unauthurized"))
        }
        jwt.verify(token, process.env.JWT_KEY, (err, user) => {
            if (err) {
                return next(errorHandler(401, "UnAuthurized"))
            }
             req.user = user;
            next();
        })
    }
    catch(err){
        return next(errorHandler(500, "some error "))
    }

}