
import mongoose from "mongoose";

const postSchema = mongoose.Schema({
    // name
    title: {
        type: String,
        required: true,
        unique: true,
    },
    userId: {
        type: String,
        required: true,
    },
    // discription
    content: {
        type: String,
        required: true
    },
    // logo
    image: {
        type: String,
        default: "https://www.hostinger.com/tutorials/wp-content/uploads/sites/2/2021/09/how-to-write-a-blog-post.png"
    },
    category: {
        type: String,
        default: "uncategorized"
    },
    slug: {
        type: String,
        required: true,
        unique: true,
    },
    bankAccount: {
        type: String,
        default: '000000'
    },
    easypaisaAccount: {
        type: String,
        default: '000000'
    },
    contact: {
        type: String,
        default: '000000'
    },
    location: {
        type: String,
        default: 'locatioin'
    },
    tailoringServices: {
        "all": String,
        "men": String,
        "women": String,
        "kids": String
    },
    employees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Employee' }],//ref to em
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }], // ref to pr
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }], // ref to or
    shopOwner: { type: mongoose.Schema.Types.ObjectId, },

},
    { timestamps: true }
)

const Post = mongoose.model('Post', postSchema);

export default Post;
