const express = require('express')
const categoryController = require('../controllers/categoryController')
const { 
    addNewCategory,
    getAllCategories,
    getAllCategoryBySellerId,
    getAllCategoryByCategoryId,
    updateCategoryDetailsByCategoryId,
    deleteCategorydetailsByCategoryId
} = categoryController
const router = express.Router()

router.post('/add-category', addNewCategory)

router.get('/getAllCategories', getAllCategories)

router.get('/categoriesBySellerId', getAllCategoryBySellerId)

router.get('/categoriesByCategoryId', getAllCategoryByCategoryId)

router.put('/updateCategoryDetailsByCategoryId', updateCategoryDetailsByCategoryId)

router.get('/deleteCategorydetailsByCategoryId', deleteCategorydetailsByCategoryId)

module.exports =  router 