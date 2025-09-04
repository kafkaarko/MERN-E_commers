const mongoose =  require("mongoose")

const Schema = mongoose.Schema;

const orderItemsSchema = new Schema({
    productId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
        required: true
    },
    quantity:{
        type: Number,
        required: true,
        min:1
    },
    price:{
        type: Number,
        required: true
    },
    subTotal:{
        type: Number,
        required: true
    }
}, {timestamps: true})

module.exports = mongoose.model('orderItem', orderItemsSchema)