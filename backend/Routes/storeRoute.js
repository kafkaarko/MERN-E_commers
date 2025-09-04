const express = require('express')
const roleMiddleware = require('../Middlewares/role')
const verifyToken = require('../Middlewares/verifyToken')
const {makeStore, myStore, myStoreUpdate, myStoreDelete, myStoreById} = require('../Controllers/storeController')
const upload = require('../Middlewares/upload')


const router = express.Router()

router.use(verifyToken)
router.use(roleMiddleware(['seller']))
router.post("/create-store",upload.single('qrisImage'), makeStore)
router.get("/my-store", myStore)
router.get("/my-store/:id", myStoreById)
router.patch("/my-store/:id",upload.single('qrisImage'), myStoreUpdate)
router.delete("/my-store/:id", myStoreDelete)
module.exports = router