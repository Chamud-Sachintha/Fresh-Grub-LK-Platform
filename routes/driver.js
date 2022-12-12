const express = require('express')
const driverController = require('../controllers/driverController')
const jwtValidator = require('../middlewares/validJWTValidator')
const userAuth = require('../middlewares/userAuth')
const router = express.Router()
const { 
    signUp, 
    login,
    assignDriverToOrderRequest,
    getAssignedDriverDetails,
    getAvailableDeliveryRequestsByDriverId,
    getDeliveryRequestDetailsByOrderId,
    updateDeliveryStatusByOrderId,
    getDeliveryRequestStatusByOrderId,
    getCompletedDeleveryRequestByDriverId
} = driverController

router.post('/signup',userAuth.checkDriverRegDetails, signUp)

router.post('/login', login )

router.get('/asign/driver', assignDriverToOrderRequest)

router.get('/search/assignedDriver', getAssignedDriverDetails)

router.get('/search/getAvailableDeliveryRequestsByDriverId', getAvailableDeliveryRequestsByDriverId)

router.get('/search/getDeliveryRequestDetails', getDeliveryRequestDetailsByOrderId)

router.get('/update/deliveryStatusByOrderId', updateDeliveryStatusByOrderId)

router.get('/search/getDeliveryStatusByOrderId', getDeliveryRequestStatusByOrderId)

router.get('/search/getCompletedDeleveryRequestByDriverId', getCompletedDeleveryRequestByDriverId)

module.exports = router
