const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const storeSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    ownerId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"user",
        required: true,
    },
    balance:{
        type: Number,
        default: 0
    },      
    bankAccount:{
        bankName:{type: String, required: true}, //banknya
        accountNumber:{type: Number, required: true}, //nomornya
        accountHolder:{type: String, required: true} // pemilik atas nama
    },
    qris:{
        qrisCode:{type: String,},
    },
    qrisImage:{type: String},

},{timestamps: true})

module.exports = mongoose.model("store", storeSchema)