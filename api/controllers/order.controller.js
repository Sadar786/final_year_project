// Orders.controller.js

 import { errorHandler } from '../utils/error.js';
 import Order from '../modules/order.model.js'


export const createOrder = async (req, res, next) => {
    
 
    try {
        const newOrder = new Order({
            ...req.body, // Spread req.body instead of body
        });

        const saveOrder = await newOrder.save(); // Add await here to save the new Order to the database
        res.status(201).json(saveOrder);
    } catch (err) {
        return next(errorHandler(500, `Could not create Order. Please try again later. ${ err}`));
    }
}

export const getMyOrders = async (req, res, next) => {
    try {
      const { shopId } = req.params; // Extract shopId from request parameters
      console.log("paymentMethod id getMyOrder : " +shopId);
      
      // Query Orders with the extracted shopId
      const Orders = await Order.find({ shopId });
      
      res.status(200).json(Orders);
    } catch (err) {
      next(errorHandler(500, `Could not retrieve Orders. Please try again later. ${err.message}`));
    }
  };
  
export const getOrders = async (req, res, next) => {
    try {
        const shopId = req.params.shopId
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.order === 'asc' ? 1 : -1;

        
        const { customer,ownerApproval, paymentMethod, items, status, searchTerm } = req.query;
        const query = {};

        if (shopId) {
            query.shopId = shopId;
        }
        if (customer) {
            query.customer = customer;
        }
        if (items) {
            query.items = items;
        }
        if (paymentMethod) {
            query.paymentMethod = paymentMethod;
        }
        if (status) {
            query._id = status;
        }
        if (ownerApproval) {
            query.ownerApproval = ownerApproval;
        }
        if (searchTerm) {
            query.$or = [
                { name: { $regex: searchTerm, $options: 'i' } },
                { description: { $regex: searchTerm, $options: 'i' } }
            ];
        }

        const Orders = await Order.find(query)
            .sort({ updatedAt: sortDirection })
            .skip(startIndex)
            .limit(limit);

        const totalOrders = await Order.countDocuments(query);
        const now = new Date();
        const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        const lastMonthOrders = await Order.countDocuments({
            createdAt: { $gte: oneMonthAgo }
        });

        res.status(200).json({
            Orders,
            totalOrders,
            lastMonthOrders
        });

    } catch (error) {
        next(error);
    }
};

// const removeOrderFrompaymentMethod = async (shopId, status) => {
//     try {
//         const updatedpaymentMethod = await Order.findByIdAndUpdate(
//             shopId,
//             { $pull: { Orders: status } }, // Use $pull to remove status
//             { new: true, runValidators: true }
//         );

//         if (!updatedpaymentMethod) {
//             throw new Error("paymentMethod not found");
//         }

//         console.log("Order removed from paymentMethod successfully");
//     } catch (error) {
//         throw new Error("Failed to remove Order from paymentMethod: " + error.message);
//     }
// };

export const deleteOrder = async (req, res, next) => {
    const { orderId, userId } = req.params;
    if(req.user.id !== userId ){
        return errorHandler(403, "you are allowed to delete")
    }
 
    try {
        const deletedOrder = await Order.findByIdAndDelete(orderId);

        if (!deletedOrder) {
            return next(errorHandler(404, "Order not found!"));
        }

        // Remove the Order from the paymentMethod document
        // await removeOrderFrompaymentMethod(shopId, status);

        res.status(200).json({ message: "Order has been deleted successfully!" });
        console.log("Order deleted successfully");
    } catch (error) {
        console.error("Error deleting Order:", error);
        next(errorHandler(500, "An error occurred while deleting the Order."));
    }
};

// export const deleteOrdersByshopId = async (shopId) => {
//     try {
//         // Delete all Orders where shopId matches
//         const deletedOrders = await Order.deleteMany({ shopId: shopId });
//         console.log(`Deleted ${deletedOrders.deletedCount} Orders associated with paymentMethod ${shopId}`);
//     } catch (error) {
//         throw new Error(`Failed to delete Orders associated with paymentMethod: ${error.message}`);
//     }
// };

export const updateOrder = async (req, res, next) =>{
    console.log(req.params.userId)
    if(req.user.id !== req.params.userId && req.user.haveAShop){
      next(errorHandler(403, "you are not Authurized to update Order."))
      return ;
    }

    const {paymentMethod, paidAmcount, PaymentUpoadedPicture, status , ownerApproval, deliveryAddress} = req.body;

    const updatedFields = {};
    if (paymentMethod) updatedFields.paymentMethod = paymentMethod;
    if (ownerApproval) updatedFields.ownerApproval = ownerApproval;
    if (paidAmcount) updatedFields.paidAmcount = paidAmcount;
    if (status) updatedFields.status = status;
    if (PaymentUpoadedPicture) updatedFields.PaymentUpoadedPicture = PaymentUpoadedPicture;
    if (deliveryAddress) updatedFields.deliveryAddress = deliveryAddress;
    

    try {
        
        const updateOrder = await Order.findByIdAndUpdate(
            req.params.orderId,
            {
                $set: updatedFields

            },
            {new: true}
        )
        if(!updateOrder){
            next(errorHandler(401, "some error occured."))
        }
        else{
            res.status(200).json(updateOrder);

        }
        
    } catch (error) {
        next(errorHandler(500, "An Error occurred while updating Order."+ error.message))
        
    }
}
