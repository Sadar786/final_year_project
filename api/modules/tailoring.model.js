import mongoose from "mongoose";

const tailoringSchema = mongoose.Schema({
  shopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop', // Assuming 'Shop' is the name of your shop model
    required: true
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming 'User' is the name of your customer model
    required: true
  },
  customerName: {
    type: String,
    required: true
  },
  customerEmail: {
    type: String,
    required: true
  },
  customerContact: {
    type: String,
    default: '00000000000'
  },
  costumerAddress: {
    type: String,
    default: 'ABC'
  },
  measurementForm: {
    type: Object
  },
  selected_design: {
    type: String,
    default: "general"
  },
  status: {
    type: String,
    default: "Pending"
  },
  completion_date: {
    type: Date,
    default: null
  },
  tailoringPrice: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    default: "CashOnDelivery"
  },
  assignToTailor: {
    type: Boolean,
    default: false,
  },
  tailorName: {
    type: String,
    default: null
  } ,
  tailorId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Employee',
  default: null
  },
  removeFromUser:{
    type:Boolean,
    default: false
  }
}, { timestamps: true });

const Tailoring = mongoose.model("Tailoring", tailoringSchema);
export default Tailoring;
