const Order = require("../Model/OrderModel");
const mongoose = require("mongoose");
const { errorResponse, successResponse } = require("../Utils/response");

const hasShipped = async (req, res) => {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return errorResponse(res, "there no order", null)
    }

    const order = await Order.findById({ _id: id })
    if (!order) return errorResponse(res, "order not found", null)

    if (order.status !== "paid" && order.paymentId.method !== "COD") return errorResponse(res, `your ${order.id} must be paid first`, null)

    try {
        const changeStatus = await Order.findByIdAndUpdate({ _id: id }, { status: "shipped" }, { new: true })
        return successResponse(res, `your ${order.id} is shipped`, changeStatus)
    } catch (error) {
        return errorResponse(res, "something wrong, please try again", { message: error.message })

    }
}

const hasDeliverd = async (req, res) => {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return errorResponse(res, "there no order", null)
    }

    const order = await Order.findById({ _id: id })
    if (!order) return errorResponse(res, "order not found", null)
    if (order.status !== "shipped") return errorResponse(res, `your ${order.id} must be shipped first`, null)


    try {
        const changeStatus = await Order.findByIdAndUpdate({ _id: id }, { status: "delivered" }, { new: true })
        return successResponse(res, `your ${order.id} is delivered`, changeStatus)
    } catch (error) {
        return errorResponse(res, "something wrong, please try again", { message: error.message })

    }
}

const hasPaid = async (req, res) => {
    const { id } = req.params
    const {money} = req.body
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return errorResponse(res, "there no order", null)
    }

    try {
        const order = await Order.findById({ _id: id })
        if (!order) return errorResponse(res, "order not found", null)

        if (order.paymentId.method === "COD") {
            order.status = 'paid';
            await order.save()
        }else{
            if(!money ) return errorResponse(res, "please input the money", null)

            if(money < order.total_price) return errorResponse(res, "your money not enough", null)

            order.status = 'paid'
        }
        await order.save()
        return successResponse(res, `your has paid the ${order.id}`, order)
    } catch (error) {
        return errorResponse(res, "something wrong, please try again", { message: error.message })
    }

}

const hasArrieved = async (req, res) => {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return errorResponse(res, "there no order", null)
    }


    const order = await Order.findById({ _id: id })
    if (!order) return errorResponse(res, "order not found", null)
    if (order.status !== "delivered") return errorResponse(res, `your ${order.id} must be deliverd first`, null)

    try {
        const changeStatus = await Order.findByIdAndUpdate({ _id: id }, { status: "arrieved" }, { new: true })
        return successResponse(res, `your ${order.id} is arrieved`, changeStatus)
    } catch (error) {
        return errorResponse(res, "something wrong, please try again", { message: error.message })

    }
}

const hasCancled = async (req, res) => {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return errorResponse(res, "there no order", null)
    }

    const order = await Order.findById({ _id: id })
    if (!order) return errorResponse(res, "order not found", null)

    try {
        const changeStatus = await Order.findByIdAndUpdate({ _id: id }, { status: "cancled" }, { new: true })
        return successResponse(res, `your ${order.id} is cancel`, changeStatus)
    } catch (error) {
        return errorResponse(res, "something wrong, please try again", { message: error.message })

    }
}

module.exports = { hasArrieved, hasCancled, hasDeliverd, hasPaid, hasShipped }