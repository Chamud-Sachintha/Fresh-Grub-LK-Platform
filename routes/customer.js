//importing modules
const express = require('express')
const userController = require('../controllers/customerController')
const jwtValidator = require('../middlewares/validJWTValidator')
const { 
    signup, 
    login, 
    getCategoriesOfSelectedRestuarant,
    getAssignedDriverForOrderByOrderId,
    test 
} = userController

const cartController = require('../controllers/cartController')
const { 
    addSelectedEatablesToCart,
    getAllCartItemsByCustomerAndEachCart,
    getAllCartsByCustomerId
} = cartController

const orderController = require('../controllers/orderController')
const {
    placeNewOrderDetailsByCustomer,
    getAllOrdersByCustomerId
} = orderController

const userAuth = require('../middlewares/userAuth')

const router = express.Router()

//signup endpoint
//passing the middleware function to the signup
router.post('/signup', signup)

//login route
router.post('/login', login )

router.get('/getCategoriesOfSelectedRestuarant', getCategoriesOfSelectedRestuarant)

router.post('/addToCart', addSelectedEatablesToCart)

router.get('/getAllCartsByCustomerId/search', getAllCartsByCustomerId)

router.get('/getAllCartItemsByCustomerAndEachCart/search', getAllCartItemsByCustomerAndEachCart)

router.post('/placeOrder', placeNewOrderDetailsByCustomer)

router.get('/getAllOrdersByCustomer', getAllOrdersByCustomerId)

router.get('/search/getAssignedDriverForOrderByOrderId', getAssignedDriverForOrderByOrderId)

router.get('/jj', jwtValidator.validJWTNeeded, test)

module.exports = router