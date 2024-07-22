// products.controller.js

import Product from '../modules/products.model.js';
import { errorHandler } from '../utils/error.js';
import Post from '../modules/shop.model.js';

export const createProduct = async (req, res, next) => {
    
    const slug = req.body.name.split(' ').join('').toLowerCase().replace(/[^a-zA-Z0-9-]/g, '');

    try {
        const newProduct = new Product({
            ...req.body, // Spread req.body instead of body
            slug,
            userId: req.user.id,
        });

        const saveProduct = await newProduct.save(); // Add await here to save the new Product to the database
        res.status(201).json(saveProduct);
    } catch (err) {
        return next(errorHandler(500, `Could not create Product. Please try again later. ${ err}`));
    }
}


export const getMyProducts = async (req, res, next) => {
    try {
      const { shopId } = req.params; // Extract shopId from request parameters
      console.log("shop id getMyShop " +shopId);
      
      // Query products with the extracted shopId
      const products = await Product.find({ shopId: shopId });
      
      res.status(200).json(products);
    } catch (err) {
      next(errorHandler(500, `Could not retrieve products. Please try again later. ${err.message}`));
    }
  };
  

export const getProducts = async (req, res, next) => {
    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.order === 'asc' ? 1 : -1;

        const { category, slug, productId, searchTerm, onSale ,shopId } = req.query;
        const query = {};

         if (category && category !== 'All') {
          query.category = category;
        }
         
        if (shopId) {
            query.shopId = shopId;
        }
        if (onSale) {
            query.onSale = onSale;
        }
        if (slug) {
            query.slug = slug;
        }
        if (productId) {
            query._id = productId;
        }
        if (searchTerm) {
            query.$or = [
                { name: { $regex: searchTerm, $options: 'i' } },
                { description: { $regex: searchTerm, $options: 'i' } }
            ];
        }

        const products = await Product.find(query)
            .sort({ updatedAt: sortDirection })
            .skip(startIndex)
            .limit(limit);

        const totalProducts = await Product.countDocuments(query);
        const now = new Date();
        const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        const lastMonthProducts = await Product.countDocuments({
            createdAt: { $gte: oneMonthAgo }
        });

        res.status(200).json({
            products,
            totalProducts,
            lastMonthProducts
        });

    } catch (error) {
        next(error);
    }
};

const removeProductFromShop = async (shopId, productId) => {
    try {
        const updatedShop = await Post.findByIdAndUpdate(
            shopId,
            { $pull: { products: productId } }, // Use $pull to remove productId
            { new: true, runValidators: true }
        );

        if (!updatedShop) {
            throw new Error("Shop not found");
        }

        console.log("Product removed from shop successfully");
    } catch (error) {
        throw new Error("Failed to remove product from shop: " + error.message);
    }
};

export const deleteProduct = async (req, res, next) => {
    const { productId, userId, shopId } = req.params;
    if(req.user.id !== userId){
        return errorHandler(403, "you are allowed to delete")
    }
 
    try {
        const deletedProduct = await Product.findByIdAndDelete(productId);

        if (!deletedProduct) {
            return next(errorHandler(404, "Product not found!"));
        }

        // Remove the product from the shop document
        await removeProductFromShop(shopId, productId);

        res.status(200).json({ message: "Product has been deleted successfully!" });
        console.log("Product deleted successfully");
    } catch (error) {
        console.error("Error deleting Product:", error);
        next(errorHandler(500, "An error occurred while deleting the Product."));
    }
};

export const deleteProductsByShopId = async (shopId) => {
    try {
        // Delete all products where shopId matches
        const deletedProducts = await Product.deleteMany({ shopId: shopId });
        console.log(`Deleted ${deletedProducts.deletedCount} products associated with shop ${shopId}`);
    } catch (error) {
        throw new Error(`Failed to delete products associated with shop: ${error.message}`);
    }
};