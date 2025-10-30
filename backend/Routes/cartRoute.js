const express = require("express")
const {getAllCart, addToCart, editCart, deleteCart, checkout, getChekoutUserById, getAllCartById} = require("../Controllers/cartContoller")
const verifyToken = require("../Middlewares/verifyToken")

const router = express.Router()

router.use(verifyToken)
router.get('/',getAllCart)
router.get('/items',getAllCartById)
router.get('/checkout',getChekoutUserById)
router.post('/',addToCart)
router.patch('/:id',editCart)  
router.delete('/:id',deleteCart)
router.post('/checkout', checkout)

module.exports = router