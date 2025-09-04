const Cart = require("../Model/CartModel")
const Order = require("../Model/OrderModel")
const OrderItems = require("../Model/OrderItemsModel")
const Product = require("../Model/ProductModel")
const Payment = require("../Model/PaymentModel")
const mongoose = require('mongoose')
const { successResponse, errorResponse } = require("../Utils/response")

const getAllCart = async (req, res) => {
    const cart = await Cart.find(
        { userId: req.user.id }
    ).populate("items.productId")


    return successResponse(res, "success to get cart", cart)
}

const addToCart = async (req, res) => {
    const { items } = req.body
    try {
        let total = 0;

        const cartItems = await Promise.all( //pake promise karena js itu kerjanya atu line ama beres jadinya line 20 janji bakal ada outpunya
            items.map(async (item) => {
                const product = await Product.findById(item.productId)
                if (!product) {
                    throw new Error(`Product with Id ${item.productId} is not found`)
                }
                if (product.stock < item.quantity) {
                    return errorResponse(res, `stock ${product.name} note enough`, null)
                }
                total += product.price * item.quantity
                console.log(item.quantity)
                return {
                    productId: item.productId,
                    quantity: item.quantity
                }
            }),
        )
        const cart = await Cart.create({
            userId: req.user.id,
            items: cartItems,
            grandTotal: total
        })
        return successResponse(res, "success to add cart", cart)
    } catch (error) {
        return errorResponse(res, "something wrong", { message: error.message })
    }
}

const editCart = async (req, res) => {
    const { id } = req.params
    const { productId, quantity } = req.body


    try {
        const cart = await Cart.findById({ _id: id })
        if (!cart) return errorResponse(res, "cart not found", null)
        const product = await Product.findById({ _id: productId })

        const item = cart.items.find(item => item.productId._id.toString() === productId)
        if (item === -1) return errorResponse(res, "no product in the cart", null)

        //update quantity
        item.quantity = quantity
        // console.log(cart)z
        cart.grandTotal = cart.items.reduce((total, item) => {
            return total + product.price * item.quantity
        }, 0)

        await cart.save()
        return successResponse(res, "success edit cart", cart)
    } catch (error) {
        return errorResponse(res, "something wrong", { message: error.message })
    }
}

const deleteCart = async (req, res) => {
    const { id } = req.params

    try {
        const cart = await Cart.findByIdAndDelete({ _id: id })
        if (!cart) return errorResponse(res, "cart not found", null)

        return successResponse(res, "success delete cart", cart)
    } catch (error) {
        return errorResponse(res, "something wrong", { message: error.message })
    }

}

const checkout = async (req, res) => {
    const { id } = req.params
    const { method, shippingAddress, } = req.body

    const cart = await Cart.findById({ _id: id }).populate("items.productId")
    if (!cart) return errorResponse(res, "cart not found", null)

    try {

        const orderItemsData = cart.items.map((c) => {
            // const product =  Product.find((p) => p._id.toString() === c.productId._id.toString())
            //mencari product id yang sama di dalam cart
            const subTotal = c.productId.price * c.quantity

            return ({
                productId: c.productId._id,
                quantity: c.quantity,
                price: c.productId.price,
                subTotal
            })
        })

        const orderItems = await OrderItems.insertMany(orderItemsData) //masukan

        const totalPrice = await orderItems.reduce((acc, item) => acc + item.subTotal, 0)

        const payment = await Payment.create({
            method
        })

        const order = await Order.create({
            userId: req.user.id,
            shippingAddress,
            orderItemsId: orderItems.map((oi) => oi._id),
            total_price: totalPrice,
            paymentId: payment._id
        })
        await Promise.all(orderItems.map(async (item) => {
            const prod = await Product.findById(item.productId);
            if (!prod) return;

            prod.stock -= item.quantity;
            if (prod.stock < 0) {
                throw new Error(`Stock not enough for product ${prod.name}`);
            }

            await prod.save();
        }));
        cart = [];
        await cart.save();


        //buat agar stok berkurang saat di buat orderannya


        return successResponse(res, "success to checkout", order)
    } catch (error) {
        return errorResponse(res, "something wrong", { message: error.message })

    }
}

const getChekoutUserById = async (req, res) => {
    const order = await Order.find({ userId: req.user.id }).populate(['userId', 'orderItemsId', 'paymentId']).select("-password")
    return successResponse(res, "success to get chekout by id", order)
}


module.exports = { getAllCart, addToCart, editCart, deleteCart, checkout, getChekoutUserById }