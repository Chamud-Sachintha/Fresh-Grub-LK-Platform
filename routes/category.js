const express = require('express')
const categoryController = require('../controllers/categoryController')
const { 
    addNewCategory,
    getAllCategories,
    getAllCategoryBySellerId
} = categoryController
const router = express.Router()

router.post('/add-category', addNewCategory)

router.get('/getAllCategories', getAllCategories)

router.get('/categoriesBySellerId', getAllCategoryBySellerId)


module.exports =  router 