const express = require('express')
const categoryController = require('../controllers/categoryController')
const { 
    addNewCategory,
    getAllCategories
} = categoryController
const router = express.Router()

router.post('/add-category', addNewCategory)

router.get('/getAllCategories', getAllCategories)


module.exports =  router 