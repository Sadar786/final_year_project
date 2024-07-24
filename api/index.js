import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import AuthRouter from './routers/auth.routes.js';
import UserRouter from './routers/user.routes.js';
import shopRouter from './routers/shop.router.js';
import ProductsRouter from './routers/product.routes.js'
import employeeRouter from './routers/employee.routes.js'
import OrderRouter from './routers/order.routes.js';
import tailoringtRouter from './routers/tailoring.router.js'
import EmailRounter from './routers/mailer.router.js';
import commentRouter from './routers/comment.routes.js';
import pdfRouter from './routers/pdf.routes.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(cookieParser());
app.use(express.json());


const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/fyp1");
    console.log('MongoDB connected...');
  } catch (err) {
    console.error('Error occurred while connecting to database:', err);
    process.exit(1); // Exit process with failure
  }
};

connectDB();

app.use('/api/auth', AuthRouter);
app.use('/api/user', UserRouter);
app.use('/api/post', shopRouter);
app.use('/api/product', ProductsRouter);
app.use('/api/employee', employeeRouter);
app.use('/api/order', OrderRouter);
app.use('/api/tailoring' , tailoringtRouter)
app.use('/api/email' , EmailRounter)
app.use('/api/comment', commentRouter)
app.use('/api/pdf', pdfRouter)


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.use((error, req, res, next) =>{
  const statusCode = error.statusCode || 500;
  const message = error.message || "server internal error";
  res.status(statusCode).json({
      success: false,
      statusCode,
      message
  })
})