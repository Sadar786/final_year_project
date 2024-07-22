// Employees.controller.js
import mongoose from 'mongoose';
import Employee from '../modules/employee.model.js';
import { errorHandler } from '../utils/error.js';
import Shop from '../modules/shop.model.js';

export const createEmployee = async (req, res, next) => {
    const { name, role, salary, totalClothesAssign, totalClothesCompleted, totalPendingClothes, shopId, assignClothes } = req.body;
    const slug = name.split(' ').join('').toLowerCase().replace(/[^a-zA-Z0-9-]/g, '');

    try {
        // Create a new Employee instance with all the required fields
        const newEmployee = new Employee({
            name,
            role,
            salary,
            totalClothesAssign,
            totalClothesCompleted,
            totalPendingClothes,
            shopId,
            assignClothes,
            slug,
            userId: req.user.id
        });

        // Save the new Employee to the database
        const saveEmployee = await newEmployee.save();
        res.status(201).json(saveEmployee);
    } catch (err) {
        console.error('Error creating employee:', err);
        next(errorHandler(500, `Could not create Employee. Please try again later. ${err.message}`));
    }
};
export const getOneEmployees = async (req, res, next) => {
    try {
        const { shopId } = req.params; // Extract shopId from request parameters
        console.log("shop id getOneEmploye " + shopId);

        // Query Employees with the extracted shopId
        const Employees = await Employee.find({ shopId: shopId });

        res.status(200).json(Employees);
    } catch (err) {
        next(errorHandler(500, `Could not retrieve Employees. Please try again later. ${err.message}`));
    }
};


export const getEmployees = async (req, res, next) => {
    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.order === 'asc' ? 1 : -1;

        const {
            role,
            salary,
            totalClothesAssign,
            totalClothesCompleted,
            totalPendingClothes,
            shopId,
            searchTerm,
            ClothesAssign,
            assignClothes,
            employeeId,
        } = req.query;

        const query = {};

        if (role) query.role = role;
        if (employeeId) query._id = employeeId;
        if (ClothesAssign) query.ClothesAssign = ClothesAssign;
        if (salary) query.salary = salary;
        if (totalClothesAssign) query.totalClothesAssign = totalClothesAssign;
        if (totalClothesCompleted) query.totalClothesCompleted = totalClothesCompleted;
        if (totalPendingClothes) query.totalPendingClothes = totalPendingClothes;
        if (shopId) query.shopId = shopId;
        if (assignClothes) query.assignClothes = assignClothes;
        if (searchTerm) {
            query.$or = [{ name: { $regex: searchTerm, $options: 'i' } }];
        }

        const Employees = await Employee.find(query)
            .sort({ updatedAt: sortDirection })
            .skip(startIndex)
            .limit(limit);

        const totalEmployees = await Employee.countDocuments(query);
        const now = new Date();
        const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        const lastMonthEmployees = await Employee.countDocuments({
            createdAt: { $gte: oneMonthAgo }
        });

        res.status(200).json({
            Employees,
            totalEmployees,
            lastMonthEmployees
        });
    } catch (error) {
        next(errorHandler(500, `Could not retrieve Employees. Please try again later. ${error.message}`));
    }
};

const removeEmployeeFromShop = async (shopId, employeeId) => {
    try {
        await Shop.findByIdAndUpdate(
            shopId,
            { $pull: { Employees: employeeId } },
            { new: true, runValidators: true }
        );
    } catch (error) {
        throw new Error("Failed to remove Employee from shop: " + error.message);
    }
};


export const deleteEmployee = async (req, res, next) => {
    const { employeeId, userId, shopId } = req.params;
    if (req.user.id !== userId) {
        return next(errorHandler(403, "You are not allowed to delete this employee"));
    }

    try {
        const deletedEmployee = await Employee.findByIdAndDelete(employeeId);

        if (!deletedEmployee) {
            return next(errorHandler(404, "Employee not found!"));
        }

        await removeEmployeeFromShop(shopId, employeeId);

        res.status(200).json({ message: "Employee has been deleted successfully!" });
    } catch (error) {
        console.error("Error deleting Employee:", error);
        next(errorHandler(500, "An error occurred while deleting the Employee."));
    }
};

export const deleteEmployeesByShopId = async (req, res, next) => {
    const { shopId } = req.params;

    try {
        const deletedEmployees = await Employee.deleteMany({ shopId: shopId });
        console.log(`Deleted ${deletedEmployees.deletedCount} Employees associated with shop ${shopId}`);
        res.status(200).json({ message: `${deletedEmployees.deletedCount} Employees deleted successfully` });
    } catch (error) {
        next(errorHandler(500, `Failed to delete Employees associated with shop: ${error.message}`));
    }
};

export const updateEmployee = async (req, res, next) => {

    const { employeeId } = req.params;

    const {
        tailoringOrderId,
        role,
        salary,
        totalClothesAssign,
        totalClothesCompleted,
        totalPendingClothes,
        shopId,
        orderIdToAssign,
        totalAmountByTailoring,
        name,
        tailoringStatus,
    } = req.body;


    const update = {};

    if (role) update.role = role;
    if (name) update.name = name;
    if (salary) update.salary = salary;
    if (totalClothesAssign) update.totalClothesAssign = totalClothesAssign;
    if (totalClothesCompleted) update.totalClothesCompleted = totalClothesCompleted;
    if (totalPendingClothes) update.totalPendingClothes = totalPendingClothes;
    if (shopId) update.shopId = shopId;
    if (tailoringOrderId) update.tailoringOrderId = tailoringOrderId;


    try {
        // Validate if employeeId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(employeeId)) {
            throw new Error("Invalid Employee ID");
        }

        const updateQuery = {};

        if (Object.keys(update).length > 0) {
            updateQuery.$set = update;
        }

        if (orderIdToAssign) {
            updateQuery.$push = { ClothesAssign: new mongoose.Types.ObjectId(orderIdToAssign) };
            updateQuery.$inc = {
                totalClothesAssign: 1,
            };

        }

        console.log("tailoring status  "+ tailoringStatus)

        if (tailoringStatus === 'Completed' || totalAmountByTailoring !== undefined) {
            updateQuery.$inc = {
                totalAmountByTailoring: totalAmountByTailoring,
                totalClothesCompleted : 1,
                totalClothesAssign: -1,
            }
        }

        const updatedEmployee = await Employee.findByIdAndUpdate(
            employeeId,
            updateQuery,
            { new: true }
        );

        if (!updatedEmployee) {
            next(errorHandler(401, "Some error occurred."));
        } else {
            res.status(200).json(updatedEmployee);
        }

    } catch (error) {
        next(errorHandler(500, "An error occurred while updating Employee: " + error.message));
    }
};

export const removeTailoringOrderFromEmployee = async (req, res, next) => {
    try {
        const { employeeId, orderId } = req.params;
        const { orderStatus } = req.body;

        if (!mongoose.Types.ObjectId.isValid(employeeId)) {
            throw new Error("Invalid Employee ID");
        }

        const updateEmp = {};
        if (orderId) {
            updateEmp.$pull = { ClothesAssign: new mongoose.Types.ObjectId(orderId) };

            if (orderStatus === 'Pending' || orderStatus === 'Proccessing') {
                updateEmp.$inc = { totalClothesAssign: -1 };
            } 
        }

        const updatedEmployee = await Employee.findByIdAndUpdate(
            employeeId,
            updateEmp,
            { new: true }
        );

        if (!updatedEmployee) {
            next(errorHandler(401, "Some error occurred."));
        } else {
            res.status(200).json(updatedEmployee);
        }
    } catch (error) {
        next(errorHandler(500, "The order not removed from employee id: " + error.message));
    }
};


// In your Employee Controller or service


export const getTotalEmployeeSalaries = async (shopId) => {

    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    return Employee.aggregate([
        {
            $match: {
                shopId: new mongoose.Types.ObjectId(shopId),
                createdAt: { $gte: oneYearAgo },
            }
        },
        {
            $group: {
                _id: {
                    year: { $year: "$createdAt" },
                    month: { $month: "$createdAt" }
                },
                totalSalary: { $sum: "$salary" }
            }
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);
};



export const getTotalAmountByTailoring = async (shopId) => {

    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    return Employee.aggregate([
        {
            $match: {
                shopId: new mongoose.Types.ObjectId(shopId),
                createdAt: { $gte: oneYearAgo },
            }
        },
        {
            $group: {
                _id: {
                    year: { $year: "$createdAt" },
                    month: { $month: "$createdAt" }
                },
                totalAmountByTailoring: { $sum: "$totalAmountByTailoring" }
            }
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);
};

export const generateMonthlyReport = async (req, res, next) => {
    const { shopId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(shopId)) {
        return res.status(400).json({ message: 'Invalid shopId' });
    }

    try {
        const [tailoringReport, employeeSalaries] = await Promise.all([
            getTotalAmountByTailoring(shopId),
            getTotalEmployeeSalaries(shopId)
        ]);

        const result = {
            totalAmountByTailoring: tailoringReport,
            totalSalaries: employeeSalaries
        };

        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
        next(error);
    }
};




export const generateShopEmployeeReport = async (req, res, next) => {
        const { shopId } = req.params;
        const startOfYear = new Date(new Date().getFullYear(), 0, 1);
      
        try {
          const report = await Employee.aggregate([
            {
              $match: { 
                shopId:new mongoose.Types.ObjectId(shopId),
                createdAt: { $gte: startOfYear}
              }
            },
            {
              $addFields: {
                year: { $year: "$createdAt" },
                month: { $month: "$createdAt" }
              }
            },
            {
              $group: {
                _id: {
                  employeeId: "$_id",
                  year: "$year",
                  month: "$month"
                },
                name: { $first: "$name" },
                phone: { $first: "$phone" },
                salary: { $first: "$salary" },
                totalClothesAssign: { $sum: "$totalClothesAssign" },
                totalClothesCompleted: { $sum: "$totalClothesCompleted" },
                totalAmountByTailoring: { $sum: "$totalAmountByTailoring" }
              }
            },
            {
              $sort: {
                "_id.year": 1,
                "_id.month": 1
              }
            },
            {
              $project: {
                _id: 0,
                year: "$_id.year",
                month: "$_id.month",
                name: 1,
                phone: 1,
                salary: 1,
                totalClothesAssign: 1,
                totalClothesCompleted: 1,
                totalAmountByTailoring: 1
              }
            }
          ]);
      
          res.json(report);
        } catch (err) {
          console.error('Error generating shop employee report:', err);
          res.status(500).send('Server error');
        }
      };
      