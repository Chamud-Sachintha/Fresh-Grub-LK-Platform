const express = require('express')
const eatableController = require('../controllers/eatableController')
const { 
    addNewEatable,
    getAllEatablesBySellerId,
    getEatablesBelongsToRestuarant,
    getEatableDetailsByEatableId,
    getEatablesByOrderId,
    getEatableBySearchType,
    getEatableByCustomerSearchType
} = eatableController
const router = express.Router()

router.post('/add-eatable', addNewEatable)

router.get('/getAllEatablesBySellerId', getAllEatablesBySellerId)

router.get('/getEatablesBelongsToRestuarant', getEatablesBelongsToRestuarant)

router.get('/getEatableDetailsByEatableId', getEatableDetailsByEatableId)

router.get('/getEatablesByOrderId', getEatablesByOrderId)

router.get('/getEatableBySearchType', getEatableBySearchType)

router.get('/getEatableByCustomerSearchType', getEatableByCustomerSearchType)

module.exports =  router 