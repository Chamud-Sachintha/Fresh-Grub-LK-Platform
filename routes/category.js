const express = require('express')
const categoryController = require('../controllers/categoryController')
const { 
    addNewCategory
} = categoryController
const router = express.Router()

router.post('/add-category', addNewCategory)


module.exports =  router 