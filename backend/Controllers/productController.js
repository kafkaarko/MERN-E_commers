const Product = require('../Model/ProductModel');
const Store = require("../Model/StoreModel")
const mongoose = require('mongoose');
const fs = require('fs')
const path = require('path')
const { successResponse, errorResponse } = require('../Utils/response');
const UserModel = require('../Model/UserModel');


const cleanImageUrl = (base, imagePath) =>
    base.replace(/\/$/, "") + "/" + imagePath.replace(/^\//, "");


const getAllProducts = async (req, res) => {
    try {
        const product = await Product.find().populate("category").populate({path: "storeId", select: "name"});
        const base = `${req.protocol}://${req.get("host")}`;

        const productWithImageUrl = product.map((p) => ({
            _id: p._id,
            name: p.name,
            description: p.description,
            price: p.price,
            stock: p.stock,
            category: p.category,
            storeId: p.storeId,
            img_url: p.img_url ? cleanImageUrl(base, p.img_url) : null
        }))
        return successResponse(res, "successfully to get all product", productWithImageUrl)
    } catch (error) {
        return errorResponse(res, "something wrong", { message: error.message })
    }
}

const getProductById = async (req, res) => {
    try {
        const { id } = req.params
        const product = await Product.findById({ _id: id }).populate("category").populate({path: "storeId", select: "name"});
        if (!product) return errorResponse(res, "no product in there", null)
        // if (!mongoose.Types.ObjectId.isValid(id)) {
        //         return errorResponse(res, "there no product",null)
        // }
        const base = `${req.protocol}://${req.get("host")}`;
        const productWithImageUrl = ({
            _id: product._id,
            name: product.name,
            description: product.description,
            price: product.price,
            stock: product.stock,
            category: product.category,
            storeId: product.storeId,
            img_url: product.img_url ? cleanImageUrl(base, product.img_url) : null
        })
        return successResponse(res, "successfully to get prodcut by id", productWithImageUrl)

    } catch (error) {
        return errorResponse(res, "something wrong", { message: error.message })
    }
}

const getProductByCategory = async (req, res) => {
    try {
        const { id } = req.params
        const product = await Product.find({ category: id }).populate("category").populate({path: "storeId", select: "name"})
        if (!product) return errorResponse(res, "no product in there", null)
        // if (!mongoose.Types.ObjectId.isValid(id)) {
        //         return errorResponse(res, "there no product",null)
        // }
        const base = `${req.protocol}://${req.get("host")}`;
        const productWithImageUrl = product.map((p) => ({
            category: p.category,
            _id: p._id,
            name: p.name,
            description: p.description,
            price: p.price,
            stock: p.stock,
            storeId: p.storeId,
            img_url: p.img_url ? cleanImageUrl(base, p.img_url) : null
        }))
        return successResponse(res, "successfully to get category by category", productWithImageUrl)

    } catch (error) {
        return errorResponse(res, "something wrong", { message: error.message })
    }
}

const createProduct = async (req, res) => {
    try {
        const { name, description, price, stock, category } = req.body;
        const image = req.file ? `/Uploads/products/${req.file.filename}` : null;
        const user = await UserModel.findById(req.user.id)
        if(user.role !== 'seller') return errorResponse(res, "you cannot add product",null)
        const store = await Store.find({ownerId:req.user.id})

        
        const product = await Product.create({
            name,
            price: parseFloat(price),
            stock: parseInt(stock),
            description,
            img_url: image,
            category,
            storeId: store.map((s) => s._id)
        })
        const baseUrl = `${req.protocol}://${req.get("host")}`;
        return successResponse(res,
            "success product successfully",
            {
                ...product,
                image: product.img_url ? `${baseUrl}${product.img_url}` : null
            }
        )

    } catch (error) {
        return errorResponse(res, "something wrong", { message: error.message })

    }
}

const updateProduct = async (req, res) => {
    try {
        const { id } = req.params
        const { name, description, price, stock, category } = req.body;
        const image = req.file ? `/Uploads/products/${req.file.filename}` : null;

        const product = await Product.findById({ _id: id })
        if (!product) return errorResponse(res, "product not found", null)

        if (image && product.img_url) {
            const oldImagePath = path.join(
                process.cwd(),
                "uploads",
                path.basename(product.img_url)
            )

            fs.unlink(oldImagePath, (err) => {
                if (err) {
                    console.warn(
                        "gagal menghapus file lama", oldImagePath
                    )
                } else {
                    console.log("file lama terhapus", oldImagePath)
                }
            })
        }
        const updateProduct = {
            name,
            price: parseFloat(price),
            stock: parseInt(stock),
            description,
            category
        }
        if (image) updateProduct.img_url = image

        const updatedProduct = await Product.findByIdAndUpdate({
            _id: id
        },
            updateProduct
        )
        const baseUrl = `${req.protocol}://${req.get("host")}`;
        return successResponse(res, "success update product", {
            ...updatedProduct,
            image: updatedProduct.img_url ? `${baseUrl}${updatedProduct.img_url}` : null
        })


    } catch (error) {
        return errorResponse(res, "something wrong", { message: error.message })

    }
}


const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params

        const product = await Product.findById({ _id: id })
        if (!product) return errorResponse(res, "product not found", null)

        if (product.img_url) {
            const oldImagePath = path.join(
                process.cwd(),
                "Uploads",
                path.basename(product.img_url)
            )

            fs.unlink(oldImagePath, (err) => {
                if (err) {
                    console.warn(
                        "gagal menghapus file lama", oldImagePath
                    )
                } else {
                    console.log("file lama terhapus", oldImagePath)
                }
            })
        }
        await Product.findByIdAndDelete({
            _id: id
        },
        )

        return successResponse(res, "success delete product", null)


    } catch (error) {
        return errorResponse(res, "something wrong", { message: error.message })

    }
}

module.exports = { getAllProducts, getProductByCategory, getProductById, createProduct, updateProduct, deleteProduct }