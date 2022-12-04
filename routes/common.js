const express = require('express')
const commonDetailsController = require('../controllers/commonDetailsController')
const { 
   addDeliveryPrice,
   getDeliveryFee
} = commonDetailsController

const router = express.Router()

router.get('/getDeliveryFee', getDeliveryFee);

module.exports =  router