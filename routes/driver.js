const express = require('express')
const driverController = require('../controllers/driverController')
const jwtValidator = require('../middlewares/validJWTValidator')
const userAuth = require('../middlewares/userAuth')
const router = express.Router()
const { 
    signUp, 
    login, 
} = driverController

router.post('/signup',userAuth.checkDriverRegDetails, signUp)

//login route
router.post('/login', login )

module.exports = router
