const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password:{
        type: String,
        required: true
    },
    role:{
        type: String,
        enum: ["customer","admin","seller",'warehouse','courier'],
        default: "customer"
    }
}, {timestamps: true})

module.exports = mongoose.model("user",userSchema)
