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

const cartController = require('../controllers/cartController')
const { 
    addSelectedEatablesToCart,
    getAllCartItemsByCustomer
} = cartController

const orderController = require('../controllers/orderController')
const {
    placeNewOrderDetailsByCustomer
} = orderController

const userAuth = require('../middlewares/userAuth')

const router = express.Router()

//signup endpoint
//passing the middleware function to the signup
router.post('/signup', userAuth.saveUser, signup)

//login route
router.post('/login', login )

router.get('/getCategoriesOfSelectedRestuarant', getCategoriesOfSelectedRestuarant)

router.post('/addToCart', addSelectedEatablesToCart)

router.get('/getAllCartItemsByCustomer/search', getAllCartItemsByCustomer)

router.post('/placeOrder', placeNewOrderDetailsByCustomer)

router.get('/jj', jwtValidator.validJWTNeeded, test)

module.exports = router