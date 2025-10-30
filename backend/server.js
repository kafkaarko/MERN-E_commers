const express = require('express');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const { fileURLToPath } = require('url');
const mongoose = require('mongoose');

//routes
const userRoutes = require("./Routes/userRoute.js")
const categoryRoutes = require("./Routes/categoryRoute.js")
const productRoutes = require("./Routes/productRoute.js")
const cartRoutes = require("./Routes/cartRoute.js")
const storeRoutes = require("./Routes/storeRoute.js")
const orderRoutes = require("./Routes/orderRoute.js")

//set up awal
dotenv.config()
const app = express()
const PORT = process.env.PORT

//middlaware
app.use(cookieParser());
app.use(express.json())//agar bisa mengirim inputan
app.use(express.urlencoded({ extended: true }))
app.use(cors({
    origin: process.env.API_FE_URL || "http://localhost:3000",
    credentials:true
}))//agar bisa ke frontend
app.use("/uploads", express.static(path.join(process.cwd(), "Uploads")))


//routes
app.use("/api/user", userRoutes)
app.use("/api/category", categoryRoutes)
app.use("/api/product", productRoutes)
app.use("/api/cart", cartRoutes)
app.use("/api/store", storeRoutes)
app.use("/api/order", orderRoutes)

//listen on the port
mongoose.connect(process.env.MON_URI)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`connect to db and listening http://localhost:${PORT} !`)
        })
    })
    .catch((error) => {
        console.log(error)
    })
