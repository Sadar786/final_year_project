// Employee.routes.js

import express from 'express';
import { verifyUser } from '../utils/verifyUser.js';
import {generateMonthlyReport,generateShopEmployeeReport, removeTailoringOrderFromEmployee, createEmployee,updateEmployee, getOneEmployees, getEmployees, deleteEmployee, deleteEmployeesByShopId } from '../controllers/employee.controller.js';


const employeeRouter = express.Router();

employeeRouter.post('/createEmployee', verifyUser, createEmployee);
employeeRouter.get('/getEmployees', getEmployees);
employeeRouter.get('/getMyEmployees/:shopId',verifyUser, getOneEmployees );
employeeRouter.get('/monthlyReportEmployee/:shopId', verifyUser,  generateMonthlyReport)
employeeRouter.get('/employeeReport/:shopId',  generateShopEmployeeReport)
employeeRouter.delete('/deleteEmployee/:employeeId/:userId/:shopId',verifyUser, deleteEmployee);
employeeRouter.delete('/deleteEmployeesByShopId/:shopId', verifyUser, deleteEmployeesByShopId);
employeeRouter.put('/updateEmployee/:employeeId', verifyUser, updateEmployee);
employeeRouter.put('/removeOrderFormEmp/:employeeId/:orderId', verifyUser, removeTailoringOrderFromEmployee);

export default employeeRouter;
