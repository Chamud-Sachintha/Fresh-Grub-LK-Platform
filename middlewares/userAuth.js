const express = require('express');
const models = require('../models');

const Driver = models.Driver;

const checkSellerRegDetails = async (req, res, next) => {
    try {

    } catch (err) {
        console.log(err);
    }
}

const checkCustomerRegDetails = async (req, res, next) => {
    try {

    } catch (err) {
        console.log(err);
    }
}

const checkDriverRegDetails = async (req, res, next) => {
    try {
        const emailAddress = req.body.emailAddress;

        const checkEmailValidity = await Driver.findAll({
            where: {
                emailAddress: emailAddress
            }
        })

        if (checkEmailValidity) {
            res.json(400).send("Member Already Registred.");
        }

        next();
    } catch (err) {
        console.log(err);
    }
}

module.exports = { 
    checkDriverRegDetails 
};