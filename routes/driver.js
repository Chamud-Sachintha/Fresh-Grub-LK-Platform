const express = require('express')
const driverController = require('../controllers/driverController')
const jwtValidator = require('../middlewares/validJWTValidator')
const userAuth = require('../middlewares/userAuth')
const router = express.Router()
const { 
    signUp, 
    login,
    assignDriverToOrderRequest 
} = driverController

router.post('/signup',userAuth.checkDriverRegDetails, signUp)

router.post('/login', login )

router.get('/asign/driver', assignDriverToOrderRequest)

module.exports = router
