const Category = require("../Model/CatergoryModel")
const mongoose = require("mongoose")
const { successResponse, errorResponse } = require("../Utils/response")

const getAllCategory = async(req, res) =>{
    const catergory = await Category.find({}).sort({ createdAt: -1})

    return successResponse(res, "successfully to get category",catergory)
}

const getCategoryById = async(req, res) =>{
    const {id} = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return errorResponse(res, "there no category",null)
    }

    const category = await Category.findById({_id: id})
    if(!category) return errorResponse(res, "category not found, please try again",null)

    return successResponse(res, "successfully get category by id", category)
}

const createCategory = async(req, res) =>{
    const { name, description} = req.body

    if(!name) return errorResponse(res, "input the name please", null)

    try {
        const catergory = await Category.create({
            name,
            description
        });
        return successResponse(res, "success to add category",catergory)
    } catch (error) {
        return errorResponse(res, "something wrong, please try again", {message: error.message})
    }
}

const editCategory = async(req, res) =>{
    const {id} = req.params
     if (!mongoose.Types.ObjectId.isValid(id)) {
        return errorResponse(res, "there no category",null)
    }

    const {name, description} = req.body
    if(!name) return errorResponse(res, "input the name please", null)
    
    try {
        const category = await Category.findByIdAndUpdate(
            {_id:id},
            {...req.body}
        )
        return successResponse(res, "success to update category", category)
    } catch (error) {
        return errorResponse(res, "something wrong, please try again", {message: error.message})
    }
}

const deleteCategory = async(req, res) =>{
     const {id} = req.params
     if (!mongoose.Types.ObjectId.isValid(id)) {
        return errorResponse(res, "there no category",null)
    }
        try {
        const category = await Category.findByIdAndDelete(
            {_id:id},
        )
        return successResponse(res, "success to delete category",category)
    } catch (error) {
        return errorResponse(res, "something wrong, please try again", {message: error.message})
    }
}

module.exports = {getAllCategory, getCategoryById, createCategory, editCategory, deleteCategory}