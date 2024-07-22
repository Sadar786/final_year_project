import express from 'express';
import { verifyUser } from '../utils/verifyUser.js';
import {sendEmail} from '../controllers/nodemailer.controller.js';


const EmailRounter = express.Router();


EmailRounter.post('/sendEmail',verifyUser,sendEmail );

export default EmailRounter;
