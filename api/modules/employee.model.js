import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    role: {
      type: String,
      default: "general"
    },
    phoneNumber: {
      type: String,
      default: "000000"
    },
    salary: {
      type: Number,
      default: 0
    },
    ClothesAssign: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tailoring'
      }
    ],
    totalClothesAssign: {
      type: Number,
      default: 0
    },
    totalClothesCompleted: {
      type: Number,
      default: 0
    },
    totalAmountByTailoring: {
      type: Number,
      default: 0
    },
    address: {
      type: String,
      default: "ss 11 dd 22 ff 33 "
    },
    shopId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Shop' 
    },
   },
    { timestamps: true }
  );
  
  const Employee = mongoose.model('Employee', employeeSchema);
  export default Employee;