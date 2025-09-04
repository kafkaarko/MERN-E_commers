const express = require('express')
const {getAllProducts, getProductByCategory, getProductById, createProduct, updateProduct, deleteProduct} = require('../Controllers/productController')
const verifyToken = require("../Middlewares/verifyToken")
const uplod = require("../Middlewares/upload")
const roleMiddleware = require('../Middlewares/role')

const router = express.Router()

router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.get('/category/:id', getProductByCategory);
router.post('/', verifyToken,uplod.single('img_url'),roleMiddleware(['seller']), createProduct);
router.patch('/:id', verifyToken, uplod.single('img_url'),roleMiddleware(['seller']), updateProduct);
router.delete('/:id',verifyToken,roleMiddleware(['seller']), deleteProduct);

module.exports = router