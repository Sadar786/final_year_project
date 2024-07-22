//gpt modified code 
import bcryptjs from 'bcryptjs';
 import User from '../modules/user.module.js'
import { errorHandler } from '../utils/error.js';
import {getPost} from '../controllers/shop.controller.js'

export const test = async (req, res) => {
    res.json({ message: "the app is running successfully!" });
};

export const updateUser = async (req, res, next) => {
    console.log("update is called ")
    try {
        if (req.user.id !== req.params.userId) {
            return next(errorHandler(400, "You are not authorized!"));
        }

        const { username, email, password, profilePicture, haveAShop } = req.body;

        if (password && password.length < 6) {
            return next(errorHandler(400, "Password must be greater than 6 characters"));
        }

        if (username && (username.length < 7 || username.length > 20)) {
            return next(errorHandler(400, "Username must be between 7 and 20 characters"));
        }
        
        if (username && username !== username.toLowerCase()) {
            return next(errorHandler(400, "Username must be in lower case"));
        }

        if (username && username.includes(' ')) {
            return next(errorHandler(400, "Username should not contain spaces"));
        }

        if (username && !username.match(/^[a-zA-Z0-9]+$/)) {
            return next(errorHandler(400, "Username should not contain special characters"));
        }
        


        const hashedPassword = password ? await bcryptjs.hash(password, 10) : undefined;

        const updatedFields = {};
        if (username) updatedFields.username = username;
        if (email) updatedFields.email = email;
        if (hashedPassword) updatedFields.password = hashedPassword;
        if (profilePicture) updatedFields.profilePicture = profilePicture;
        if(haveAShop) updatedFields.haveAShop = haveAShop;

        
        const updatedUser = await User.findByIdAndUpdate(req.params.userId, {
            $set: updatedFields
        }, { new: true });

        if (!updatedUser) {
            return next(errorHandler(404, "User not found"));
        }
        
        const { password: userPassword, ...rest } = updatedUser._doc;
        res.status(200).json(rest);
    } catch (error) {
        next({ message: "An error occurred: " + error.message });
    }
};

export const deleteUser = async (req, res, next) => {
    console.log('deleting is calling')
      if(!req.user.isAdmin && req.user.id !== req.params.userId){
        return next(errorHandler(403, "you are not allowed to delete acount, because you are not authorized user."))
      }
      try {
          await User.findByIdAndDelete(req.params.userId)
          res.status(200).json({message: "User deleted successfully."})
          next();
        
      } catch (error) {
        next(error)
      }
}

export const signOut = async (req, res, next) =>{
    try {
        await res.clearCookie('access_token').status(200).json({message: "Sign Out Successfully."})
    } catch (error) {
        next(error)
    }
}

export const getUsers = async (req, res, next) => {
    try {
        // Check if the user is an admin
        if (!req.user.isAdmin) {
            return next(errorHandler(403, "Hey bro, you are not allowed to see users."));
        }

        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.sort === 'asc' ? 1 : -1;
      
        // Fetch users from the database
        const users = await User.find()
            .sort({ createdAt: sortDirection })
            .skip(startIndex)
            .limit(limit);

        // Remove password from the user objects
        const usersWithoutPasswords = users.map((user) => {
            const { password, ...rest } = user._doc;
            return rest;
        });

        // Get total number of users
        const totalUsers = await User.countDocuments();

        // Get users created in the last month
        const now = new Date();
        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        );

        const lastMonthUsers = await User.countDocuments({
            createdAt: { $gte: oneMonthAgo }
        });

        // Send response
        res.status(200).json({
            success: true,
            users: usersWithoutPasswords,
            totalUsers,
            lastMonthUsers
        });

    } catch (error) {
        if (error.name === 'MongoNetworkError' || error.message.includes('timed out')) {
            return next(errorHandler(500, "Database query timed out"));
        }
        // Handle any other errors
        next(errorHandler(500, "An error occurred while fetching users"));
    }
};

export const getUser = async (req, res, next) =>{
        
     try {
        const user = await User.findById(req.params.userId);
        const {password, ...rest} = user._doc;
        res.status(200).json(rest)
     } catch (error) {
        next(error)
     }
}