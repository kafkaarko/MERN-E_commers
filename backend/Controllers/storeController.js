const Store = require('../Model/StoreModel')
const Product = require('../Model/ProductModel')
const mongoose = require('mongoose')
const User = require('../Model/UserModel')
const fs = require('fs')
const path = require('path')
const { errorResponse, successResponse } = require('../Utils/response')

const cleanImageUrl = (base, imagePath) =>
    base.replace(/\/$/, "") + "/" + imagePath.replace(/^\//, "");

const myStore = async (req, res) => {
    try {
        const store = await Store.find({ ownerId: req.user.id })
        const owner = await User.findById(req.user.id)
        const base = `${req.protocol}://${req.get("host")}`;
        const storeQris = store.map((s) => ({
            _id: s._id,
            name: s.name,
            ownerId: s.ownerId,
            balance: s.balance,
            bankAccount: s.bankAccount,
            qris: s.qris,
            qrisImage: s.qrisImage ? cleanImageUrl(base, s.qrisImage) : null
        }))
        return successResponse(res, `${owner.name}'s store`, storeQris)
    } catch (error) {
        return errorResponse(res, "something wrong, please try again", { message: error.message })

    }
}

const myStoreById = async (req, res) => {
    try {
        const { id } = req.params
        const store = await Store.findById({ _id: id }).populate("ownerId")
        if (!store) return errorResponse(res, "no store in there", null)
        const products = await Product.find({storeId: id}).populate(['category','storeId'])

        const base = `${req.protocol}://${req.get("host")}`;
        const StoreWithImage = ({
            _id: store._id,
            name: store.name,
            ownerId: store.ownerId,
            balance: store.balance,
            bankAccount: store.bankAccount,
            qris: store.qris,
            qrisImage: store.qrisImage ? cleanImageUrl(base, store.qrisImage) : null
        })
        const productWithImageUrl = products.map((p) => ({
      _id: p._id,
      name: p.name,
      description: p.description,
      price: p.price,
      stock: p.stock,
      category: p.category,
      img_url: p.img_url ? cleanImageUrl(base, p.img_url) : null,
    }));
        return successResponse(res, "successfully get you store by id", {store:StoreWithImage,product:productWithImageUrl})
    } catch (error) {
        return errorResponse(res, "something wrong", { message: error.message })
    }
}

const makeStore = async (req, res) => {

    try {
        const { name, balance, bankAccount, qris } = req.body
        const qrisImage = req.file ? `/Uploads/Qris/${req.file.filename}` : null;

        const user = await User.findById({ _id: req.user.id })
        if (!user) return errorResponse(res, "login first", null)

        if (user.role !== 'seller') return errorResponse(res, "you must role seller first to make store", null)

        const storeCount = await Store.countDocuments({ ownerId: req.user.id })
        if (storeCount >= 3) return errorResponse(res, "one account max have 3 stores", null)
        const baseUrl = `${req.protocol}://${req.get("host")}`;
        const store = await Store.create({
            name,
            ownerId: req.user.id,
            balance,
            bankAccount,
            qris,
            qrisImage
        })
        return successResponse(res, "successfully make store", {
            ...store,
            image: store.qrisImage ? `${baseUrl}${store.qrisImage}` : null
        })
    } catch (error) {
        return errorResponse(res, "something wrong, please try again", { message: error.message })
    }
}

const myStoreUpdate = async (req, res) => {
    try {
        const { id } = req.params
        const { name, balance, bankAccount, qrisCode } = req.body
        const qrisFile = req.files?.qrisImage?.[0];
        const qris = qrisFile ? `/Uploads/Qris/${qrisFile.filename}` : null;

        const user = await User.findById({ _id: req.user.id })
        if (user.role !== 'seller') return errorResponse(res, "you must role seller first to make store", null)


        const store = await Store.findById({ _id: id })
        if (!store) return errorResponse(res, "no store found", null)

        if (qris && store.qris.qrisImage) {
            const oldImagePath = path.join(
                process.cwd(),
                "uploads/qris",
                path.basename(store.qris.qrisImage)
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

        const updateStore = {
            name,
            balance,
            bankAccount,
            qris:{
                qrisCode,
                qrisImage:store.qris.qrisImage
            }
        }

        
        // Save the updated store
        const updatedStore = await Store.findByIdAndUpdate({_id:id}, updateStore,{new:true});
        // Update qris.qrisImage only if a new file is uploaded
        if (qris) {
            updateStore.qris.qrisImage = qris;
        }

        const base = `${req.protocol}://${req.get("host")}`;
        return successResponse(res, "success update store", {
            ...updatedStore,
            image: updatedStore.qris.qrisImage ? `${base}${updatedStore.qris.qrisImage}` : null
        })
    } catch (error) {
        return errorResponse(res, "something wrong", { message: error.message })

    }
}

const myStoreDelete = async (req, res) => {
    try {
        const { id } = req.params

        const store = await Store.findById({ _id: id })
        if (!store) return errorResponse(res, "no store found", null)

        const user = await User.findById({ _id: req.user.id })
        if (user.role !== 'seller') return errorResponse(res, "you must role seller first to make store", null)

        if (store.qris.qrisImage) {
            const oldImagePath = path.join(
                process.cwd(),
                "uploads/qris",
                path.basename(store.qris.qrisImage)
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

        await Store.findByIdAndDelete({
            _id: id
        }
        )
        return successResponse(res, "success delete store", null)
    } catch (error) {
        return errorResponse(res, "something wrong", { message: error.message })

    }
}

module.exports = { myStore, makeStore, myStoreUpdate, myStoreById, myStoreDelete }
