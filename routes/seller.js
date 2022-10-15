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
    getListOfRestuarantsBySellerId
} = userController
const userAuth = require('../middlewares/userAuth')
const validator = require("../middlewares/validatoer")
const router = express.Router()

//signup endpoint
//passing the middleware function to the signup
router.post('/signup', userAuth.saveUser, signUp)

//login route
router.post('/login', login )

router.post('/add-restuarant', validator.checkRestuarantExist, addRestuarant)

router.get('/restuarants', getListOfRestuarants)

router.get('/restuarantsById/search', getListOfRestuarantsBySellerId)

router.get('/restuarantsByType/search', findRestuarantsBySearchType)

router.get('/restuarant/search', findRestuarantByRestuarantId)

module.exports = router