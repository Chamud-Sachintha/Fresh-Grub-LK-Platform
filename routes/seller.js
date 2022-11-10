//importing modules
const express = require('express')
const userController = require('../controllers/sellerController')
const { 
    signUp, 
    login, 
    addRestuarant, 
    getListOfRestuarants,
    findRestuarantsBySearchType,
    findRestuarantByRestuarantId,
    getListOfRestuarantsBySellerId,
    updateRestuarantrByRestuarantId,
    deleteSelectedRestuarantByRestuarantId
} = userController

const orderController = require('../controllers/orderController')
const {
    getOrderRequestsByEachSeller,
    getEachEatablesByOrderedRestuarant,
    getOnGoingOrderRequestByEachSeller,
    updateOrderStatusByrestuarantId
} = orderController
const userAuth = require('../middlewares/userAuth')
const validator = require("../middlewares/validatoer")
const router = express.Router()

//signup endpoint
//passing the middleware function to the signup
router.post('/signup', signUp)

//login route
router.post('/login', login )

router.post('/add-restuarant', validator.checkRestuarantExist, addRestuarant)

router.get('/restuarants', getListOfRestuarants)

router.get('/restuarantsById/search', getListOfRestuarantsBySellerId)

router.get('/restuarantsByType/search', findRestuarantsBySearchType)

router.get('/restuarant/search', findRestuarantByRestuarantId)

router.get('/order-requests/search', getOrderRequestsByEachSeller)

router.get('/manage-order/search', getEachEatablesByOrderedRestuarant)

router.get('/manage-order/updateOrderStatus', updateOrderStatusByrestuarantId)

router.get('/order-requests/ongoing/search', getOnGoingOrderRequestByEachSeller)

router.put('/update-restuarant', updateRestuarantrByRestuarantId)

router.get('/delete-restuarant', deleteSelectedRestuarantByRestuarantId)

module.exports = router