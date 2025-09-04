const express = require('express')
const verifyToken = require('../Middlewares/verifyToken')
const roleMiddleware = require('../Middlewares/role')
const { hasShipped, hasDeliverd, hasPaid, hasCancled } = require('../Controllers/orderController')
const canShip = require('../Middlewares/paymentMethod')

const router = express.Router()

router.patch("/paid/:id", verifyToken, hasPaid)
router.patch("/shipped/:id", verifyToken, roleMiddleware(['seller']), hasShipped)
router.patch("/delivered/:id", verifyToken, roleMiddleware(['courier']), hasDeliverd)
router.patch("/arrived/:id", verifyToken, hasShipped)
router.patch("/cancel/:id", verifyToken,  hasCancled)

module.exports = router