const mongoose = require("mongoose")

const Schema = mongoose.Schema

const paymentSchema = new Schema({
    method:{
        type: String,
        enum: ['COD', 'Bank_transfer', 'E-wallet'],
        required: true
    },
    status:{
        type: String,
        enum:['pending','paid','failed','refund'],
        default:'pending'
    },
    paidAt:{
        type: Date
    }
}, {timestamps: true})

module.exports = mongoose.model("payment", paymentSchema)