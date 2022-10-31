const express = require('express')
const profileController = require('../controllers/profileController')
const { 
    addNewProfileDetails,
    getProfileDetailsByUserId
} = profileController

const router = express.Router()

router.post('/addNewProfileDetails', addNewProfileDetails)

router.get('/getProfileDetailsByUserId', getProfileDetailsByUserId)

module.exports =  router