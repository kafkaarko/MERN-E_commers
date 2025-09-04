const express = require("express");
const {getAllCategory, getCategoryById, createCategory, editCategory, deleteCategory} = require("../Controllers/categoryController.js")
const verifyToken = require("../Middlewares/verifyToken.js");
const roleMiddleware = require("../Middlewares/role.js");


const router = express.Router();


router.get("/", getAllCategory);
router.get("/:id", getCategoryById);
router.post("/",verifyToken, roleMiddleware(['admin']), createCategory);
router.patch("/:id",verifyToken, roleMiddleware(['admin']), editCategory);
router.delete("/:id",verifyToken, roleMiddleware(['admin']),  deleteCategory);

module.exports = router;