import { errorHandler } from "../utils/error.js"
import Post from "../modules/shop.model.js"
import Product from '../modules/products.model.js'
import Employee from '../modules/employee.model.js'

export const createPost = async (req, res, next) => {
   

    if (!req.body.title || !req.body.content) {
        return next(errorHandler(400, "Please provide all required fields."))
    }

    const slug = req.body.title.split(' ').join('').toLowerCase().replace(/[^a-zA-Z0-9-]/g, '');

    try {
        const newPost = new Post({
            ...req.body, // Spread req.body instead of body
            slug,
            userId: req.user.id
        });

        const savePost = await newPost.save(); // Add await here to save the new post to the database
        res.status(201).json(savePost);
    } catch (err) {
        return next(errorHandler(500, `Could not create post. Please try again later. ${ err}`));
    }
}


export const getPosts = async (req, res, next) => {
    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.order === 'asc' ? 1 : -1;

        const {category,shopId,slug,searchTerm} = req.query
        const query = {};
        
        if (category) {
            query.category = category;
        }
        if (slug) {
            query.slug = slug;
        }
        if (shopId) {
            query._id = shopId;
        }

        if (req.query.searchTerm) {
            query.$or = [
                { title: { $regex: searchTerm, $options: 'i' } },
                { content: { $regex: searchTerm, $options: 'i' } }
            ];
        }

        const posts = await Post.find(query)
            .sort({ updatedAt: sortDirection })
            .skip(startIndex)
            .limit(limit);

        const totalPosts = await Post.countDocuments();
        const now = new Date();
        const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        const lastMonthPosts = await Post.countDocuments({
            createdAt: { $gte: oneMonthAgo }
        });

        res.status(200).json({
            posts,
            totalPosts,
            lastMonthPosts
        });

    } catch (error) {
        next(error);
    }
};

const deleteProductsByShopId = async (shopId) => {
    console.log('the shop id to delete the products ' + shopId)
    try {
        const deletedProducts = await Product.deleteMany({ shopId });
        console.log(`Deleted ${deletedProducts.deletedCount} products associated with shop ${shopId}`);
    } catch (error) {
        throw new Error(`Failed to delete products associated with shop: ${error.message}`);
    }
};

// Function to delete employees by shop ID
const deleteEmployeesByShopId = async (shopId) => {
    try {
        const deletedEmployees = await Employee.deleteMany({ shopId });
        console.log(`Deleted ${deletedEmployees.deletedCount} employees associated with shop ${shopId}`);
    } catch (error) {
        throw new Error(`Failed to delete employees associated with shop: ${error.message}`);
    }
};

// Function to delete a post (shop)
export const deletePost = async (req, res, next) => {
    const { shopId, userId } = req.params;

    if (req.params.isAdmin && req.user.id !== userId) {
        return next(errorHandler(403, "You are not allowed to delete this shop!"));
    }

    try {
        const deletedPost = await Post.findByIdAndDelete(shopId);

        if (!deletedPost) {
            return next(errorHandler(404, "Post not found!"));
        }

        res.status(200).json({ message: "Post has been deleted successfully!" });
        console.log("Post deleted successfully");

        // Ensure the proper ID is passed to the delete functions
        await deleteProductsByShopId(deletedPost._id);
        await deleteEmployeesByShopId(deletedPost._id);
    } catch (error) {
        console.error("Error deleting post:", error);
        next(errorHandler(500, "An error occurred while deleting the post."));
    }
};



export const addProductToShop = async (req, res, next) => {
    const { shopId, productId } = req.params;

    try {
        const updatedShop = await Post.findByIdAndUpdate(
            shopId,
            { $addToSet: { products: productId } }, // Use $addToSet to add productId if it's not already present
            { new: true, runValidators: true }
        )
        if (!updatedShop) {
            return next(errorHandler(404, "Shop not found"));
        }

        res.status(200).json(updatedShop);
    } catch (error) {
        next(errorHandler(500, "Failed to add product to shop: " + error.message));
    }
};


export const updatePost = async (req, res, next) =>{
    console.log(req.params.userId)
    const slug = req.body.title.split(' ').join('').toLowerCase().replace(/[^a-zA-Z0-9-]/g, '');
    if(req.user.id !== req.params.userId){
      next(errorHandler(403, "you are not Authurized to update post."))
      return ;
    }

    const {title, content, contact,category, image,bankAccount,easypaisaAccount,location} = req.body;

    const updatedFields = {};
    if (title) updatedFields.title = title;
    if (slug) updatedFields.slug = slug;
    if (content) updatedFields.content = content;
    if (category) updatedFields.category = category;
    if (image) updatedFields.image = image;
    if(location) updatedFields.location = location;
    if(bankAccount) updatedFields.bankAccount = bankAccount;
    if(easypaisaAccount) updatedFields.easypaisaAccount = easypaisaAccount;
    if(contact) updatedFields.contact = contact;
    

    try {
        
        const updatedPost = await Post.findByIdAndUpdate(
            req.params.shopId,
            {
                $set: updatedFields

            },
            {new: true}
        )
        if(!updatedPost){
            next(errorHandler(401, "some error occured."))
        }
        else{
            res.status(200).json(updatedPost);

        }
        
    } catch (error) {
        next(errorHandler(500, "An Error occurred while updating post."+ error.message))
        
    }
}

export const getPost = async (req, res, next) => {
    try {
      const post = await Post.findOne({ userId: req.params.userId });
      if (post) {
        res.status(200).json(post);
        next();
      } else {
        res.status(404).json({ message: "Post not found" });
        next(errorHandler(401, "post not found."))
      }
    } catch (error) {
      res.status(500).json({ message: "An error occurred", error: error.message });
      next(errorHandler(404, "some error occured."))

    }
  };
  