const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const orderSchema = new Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"user",
        required: true
    },
    shippingAddress:{
        street:{ type: String, required:true},
        city: {type:String, required: true},
        postalCode: { type:String, required: true},
        country: {type: String, required:true}
    },
    status:{
        type: String,
        enum: ['pending','paid','shipped','delivered','cancled','arrieved'],
        default:"pending",
    },
    orderItemsId:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "orderItem",
        required: true
    }],
    total_price:{
            type:Number,
            required: true
        },
    paymentId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"payment",
        required: true
    },
    checkoutCart:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"cart",
        required: true
    }
}, {timestamps: true})

module.exports = mongoose.model('order',orderSchema);