//importing modules
const express = require('express')
const userController = require('../controllers/customerController')
const jwtValidator = require('../middlewares/validJWTValidator')
const { 
    signup, 
    login, 
    getCategoriesOfSelectedRestuarant, 
    test 
} = userController
const userAuth = require('../middlewares/userAuth')

const router = express.Router()

//signup endpoint
//passing the middleware function to the signup
router.post('/signup', userAuth.saveUser, signup)

//login route
router.post('/login', login )

router.get('/getCategoriesOfSelectedRestuarant', getCategoriesOfSelectedRestuarant)

router.get('/jj', jwtValidator.validJWTNeeded, test)

module.exports = router