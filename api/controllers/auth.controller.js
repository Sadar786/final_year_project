import User from "../modules/user.module.js";
import bcryptjs from 'bcryptjs'
import { errorHandler } from "../utils/error.js";
import  jwt  from "jsonwebtoken";

export const signUp = async (req, res, next) =>{
        const {username, email, password} = req.body;
        if(!username || !email || !password || email === "" || email === "" || password === ""){
            return res.status(400).json({massage: "All field are required!"})
        }
        const hashPassword = bcryptjs.hashSync(password, 10)
        const newUser = new User({
            username,
            email,
            password: hashPassword
        })
        try{
        await newUser.save({ wtimeout: 20000 }); 
       res.json("Sign Up successful.")
        }
        catch(err){
            console.log("error : " + err)
            next(errorHandler(400, "All fiels are required!"));
        }
}


export const signin = async (req, res, next) =>{
    const {email, password } = req.body;
    if(!email || !password || email ==='' || password === ''){
        next(errorHandler(404 , "All feilds are required."))
    }

    try{
        const vilidUser = await User.findOne({email});
        if(!vilidUser){
          return  next(errorHandler(404, "User not found."))
        }
        const vilidPassword = await bcryptjs.compareSync(password, vilidUser.password)
        if(!vilidPassword){
           return next(errorHandler(404, "Password not found."))
        }
        const {password: pass, ...rest} = vilidUser._doc;
        const token = jwt.sign({id: vilidUser._id, isAdmin: vilidUser.isAdmin }, process.env.JWT_KEY ,  { expiresIn: '4d' });
        res.status(200).cookie('access_token', token, {
            httpOnly:true,
            expires: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000) // 4 days
        }).json(rest)
    }catch(err){
        next(err)
    }
};

export const googleAuth = async (req, res, next) => {
    const {name, email, googlePhotoUrl} = req.body;
        try {
            const user = await User.findOne({email});
            if(user){
                const token = jwt.sign({id: user._id , isAdmin: user.isAdmin } , process.env.JWT_KEY ,  { expiresIn: '4d' })
                const {password: pass, ...rest} = user._doc;
                res.status(200).cookie('access_token',token , {
                    httpOnly:true,
                    expires: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000) // 4 days
                } ).json(rest);
            }
            else{
                const generatePassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
                const hashedPassword = bcryptjs.hashSync(generatePassword, 10);
                const newUser = new User({
                    username : name.toLowerCase().split(" ").join("") + Math.random().toString(9).slice(-4),
                    email,
                    password: hashedPassword,
                    profilePicture : googlePhotoUrl,

                });
                await newUser.save();
                const token = jwt.sign({id: newUser._id, isAdmin: newUser.isAdmin }, process.env.JWT_KEY ,  { expiresIn: '4d' });
                const {password, ...rest } = newUser._doc;
                res.status(200).cookie('access_token', token , {
                    httpOnly: true,
                    expires: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000) // 4 days
                }).json(rest);
            }

        } catch (error) {
            next(error)
        }
}

 