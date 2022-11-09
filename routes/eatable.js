const express = require('express')
const eatableController = require('../controllers/eatableController')
const { 
    addNewEatable,
    getAllEatablesBySellerId,
    getEatablesBelongsToRestuarant,
    getEatableDetailsByEatableId,
    getEatablesByOrderId
} = eatableController
const router = express.Router()

router.post('/add-eatable', addNewEatable)

router.get('/getAllEatablesBySellerId', getAllEatablesBySellerId)

router.get('/getEatablesBelongsToRestuarant', getEatablesBelongsToRestuarant)

router.get('/getEatableDetailsByEatableId', getEatableDetailsByEatableId)

router.get('/getEatablesByOrderId', getEatablesByOrderId)

module.exports =  router 