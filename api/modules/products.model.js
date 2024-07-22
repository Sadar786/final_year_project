import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    image: {
        type: String,
        default: "https://firebasestorage.googleapis.com/v0/b/fyp1-659f2.appspot.com/o/1720991085791-women.png?alt=media&token=85f9ae81-799a-4071-8753-feaf188de685"
    },
    category: {
        type: String,
        default: "general"
    },
    name: {
        type: String,
        required: true,
    },
    description: String,
    price: {
        type: Number,
        required: true
    },
    quantity: Number,
    shopId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'shop.model', // Assuming 'Shop' is the name of your shop model
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user.model', // Assuming 'User' is the name of your user model
        required: true
    },
    slug: {
        type: String,
        require: true
    },
    onSale: {
        type: Boolean,
        default: false
    },
    discount: {
        type: Number,
        default: 0
    }
}
    , { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);
export default Product;
