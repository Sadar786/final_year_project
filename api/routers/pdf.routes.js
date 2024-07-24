// Employee.routes.js

import express from 'express';
import { verifyUser } from '../utils/verifyUser.js';
import {generatePdf} from '../controllers/pdf.controller.js'


const pdfRouter = express.Router();

pdfRouter.post('/generatePdf',verifyUser, generatePdf )

export default pdfRouter;
