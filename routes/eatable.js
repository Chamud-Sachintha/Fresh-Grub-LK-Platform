const express = require('express')
const eatableController = require('../controllers/eatableController')
const { 
    addNewEatable,
    getAllEatablesBySellerId,
    getEatablesBelongsToRestuarant
} = eatableController
const router = express.Router()

router.post('/add-eatable', addNewEatable)

router.get('/getAllEatablesBySellerId', getAllEatablesBySellerId)

router.get('/getEatablesBelongsToRestuarant', getEatablesBelongsToRestuarant)

module.exports =  router 