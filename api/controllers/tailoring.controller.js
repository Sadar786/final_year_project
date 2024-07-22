// Tailorings.controller.js
import mongoose from "mongoose";
import { errorHandler } from '../utils/error.js';
import Tailoring from '../modules/tailoring.model.js'


export const createTailoring = async (req, res, next) => {
  try {
    const newTailoring = new Tailoring({
      ...req.body, // Spread req.body instead of body
    });

    const saveTailoring = await newTailoring.save(); // Add await here to save the new Tailoring to the database
    res.status(200).json(saveTailoring);
  } catch (err) {
    return next(errorHandler(500, `Could not create Tailoring. Please try again later. ${err}`));
  }
}

export const getMyTailorings = async (req, res, next) => {
  try {
    const { shopId } = req.params; // Extract shopId from request parameters

    // Query Tailorings with the extracted shopId
    const tailorings = await Tailoring.find({ shopId });

    res.status(200).json(tailorings);
  } catch (err) {
    next(errorHandler(500, `Could not retrieve Tailorings. Please try again later. ${err.message}`));
  }
};

export const getTailorings = async (req, res, next) => {
  try {
    const limit =  9;
    const startIndex = parseInt(req.query.startIndex) || 0;
    const sortDirection = req.query.sortDirection === 'asc' ? 1 : -1;

    const { customerId, costumerName, paymentMethod, shopId, items, status, searchTerm } = req.query;
    const query = {};

    if (shopId) {
      query.shopId = shopId;
    }
    if (costumerName) {
      query.costumerName = costumerName;
    }
    if (customerId) {
      query.customerId = customerId;
    }
    if (items) {
      query.items = items;
    }
    if (status) {
      query._id = status;
    }
    if (paymentMethod) {
      query.paymentMethod = paymentMethod;
    }
    if (searchTerm) {
      query.$or = [
        { name: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } }
      ];
    }

    const Tailorings = await Tailoring.find(query)
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalTailorings = await Tailoring.countDocuments(query);
    const now = new Date();
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    const lastMonthTailorings = await Tailoring.countDocuments({
      createdAt: { $gte: oneMonthAgo }
    });

    res.status(200).json({
      Tailorings,
      totalTailorings,
      lastMonthTailorings
    });

  } catch (error) {
    next(error);
  }
};


// const removeTailoringFromshopId = async (shopId, status) => {
//     try {
//         const updatedshopId = await Tailoring.findByIdAndUpdate(
//             shopId,
//             { $pull: { Tailorings: status } }, // Use $pull to remove status
//             { new: true, runValidators: true }
//         );

//         if (!updatedshopId) {
//             throw new Error("shopId not found");
//         }

//         console.log("Tailoring removed from shopId successfully");
//     } catch (error) {
//         throw new Error("Failed to remove Tailoring from shopId: " + error.message);
//     }
// };

export const deleteTailoring = async (req, res, next) => {
  const { tailoringId, userId } = req.params;
  if (req.user.id !== userId) {
    return next(errorHandler(403, "You are not allowed to delete"));
  }

  try {
    const deletedTailoring = await Tailoring.findByIdAndDelete(tailoringId);

    if (!deletedTailoring) {
      return next(errorHandler(404, "Tailoring not found!"));
    }

    res.status(200).json({ message: "Tailoring has been deleted successfully!" });
    console.log("Tailoring deleted successfully");
  } catch (error) {
    console.error("Error deleting Tailoring:", error);
    next(errorHandler(500, "An error occurred while deleting the Tailoring."));
  }
};


// export const deleteTailoringsByshopId = async (shopId) => {
//     try {
// Delete all Tailorings where shopId matches
//         const deletedTailorings = await Tailoring.deleteMany({ shopId: shopId });
//         console.log(`Deleted ${deletedTailorings.deletedCount} Tailorings associated with shopId ${shopId}`);
//     } catch (error) {
//         throw new Error(`Failed to delete Tailorings associated with shopId: ${error.message}`);
//     }
// };


export const updateTailoring = async (req, res, next) => {
  if (req.user.id !== req.params.userId && req.user.haveAShop) {
    next(errorHandler(403, "You are not authorized to update Tailoring."));
    return;
  }
  const { tailoringId } = req.params;
  const {removeFromUser, tailorName, tailorId, assignToTailor, customerId, costumerName, measurementForm, status, paymentMethod, costumerAddress } = req.body;

  const updatedFields = {};
  if (tailorName) updatedFields.tailorName = tailorName;
  if (paymentMethod) updatedFields.paymentMethod = paymentMethod;
  if (tailorId) updatedFields.tailorId = tailorId;
  if (assignToTailor) updatedFields.assignToTailor = assignToTailor;
  if (customerId) updatedFields.customerId = customerId;
  if (status) updatedFields.status = status;
  if (measurementForm) updatedFields.measurementForm = measurementForm;
  if (costumerAddress) updatedFields.costumerAddress = costumerAddress;
  if (costumerName) updatedFields.costumerName = costumerName;
  if (removeFromUser) updatedFields.removeFromUser = removeFromUser;

  try {
    // Validate if tailoringId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(tailoringId)) {
      throw new Error("Invalid Tailoring ID");
    }

    const updatedTailoring = await Tailoring.findByIdAndUpdate(
      tailoringId,
      { $set: updatedFields },
      { new: true }
    );

    if (!updatedTailoring) {
      next(errorHandler(401, "Some error occurred."));
    } else {
      res.status(200).json(updatedTailoring);
    }

  } catch (error) {
    next(errorHandler(500, "An error occurred while updating Tailoring: " + error.message));
  }
};




export const tailoringFinanceReport = async (req, res, next) => {
  const { shopId, status } = req.params;


  // Validate shopId
  if (!mongoose.Types.ObjectId.isValid(shopId)) {
    return res.status(400).json({ message: 'Invalid shopId' });
  }

  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  try {
    const report = await Tailoring.aggregate([
      {
        $match: {
          shopId: new mongoose.Types.ObjectId(shopId),
          createdAt: { $gte: oneYearAgo },
          status: 'Completed',
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          totalRevenue: { $sum: "$tailoringPrice" },
          totalOrders: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    const fullReport = generateFullYearReport(report);

    res.json(fullReport);
  } catch (error) {
    res.status(500).json({ message: error.message });
    next(error);
  }
};

const generateFullYearReport = (report) => {
  const result = [];
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // JavaScript months are 0-indexed, so +1

  for (let month = 1; month <= currentMonth; month++) {
    const reportItem = report.find(item => item._id.month === month);
    result.push({
      year: currentYear,
      month: month,
      totalRevenue: reportItem ? reportItem.totalRevenue : 0,
      totalOrders: reportItem ? reportItem.totalOrders : 0
    });
  }

  return result;
};
