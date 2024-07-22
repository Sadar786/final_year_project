import mongoose from "mongoose";

const orderSchema = mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer', // Assuming 'Customer' is the name of your customer model
        required: true
    },
    shopId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shop', // Assuming 'Shop' is the name of your shop model
        required: true
    },
    items:  
        [{type: Object()}]
    ,
    paymentMethod: {
        type: String,
        default: "cashOnDelivery"
    }, // easypaisa / bank 
    paidAmcount: {
        type: Number,
        default: 0
    },
    PaymentUpoadedPicture: {
        type: String,
        default: 'null'
    },
    status: {
        type: String,
        default: "Pending"
    },
    ownerApproval: {
        type: Boolean,
        default: false
    }
    ,
    deliveryAddress: {
        type: String,
        required: true
    },
},
    { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);
export default Order;