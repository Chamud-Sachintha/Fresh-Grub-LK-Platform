const express = require('express');
const models = require('../models');

const Restuarant = models.Restuarant;

const checkRestuarantExist = async (req, res, next) => {
    try {
        const restuarant = await Restuarant.findOne({
            where:{
                restuarantName: req.body.restuarantName
            }
        });

        if (restuarant) {
            res.json(409).send("Restuarant Already Exists.")
        }

        next();
    } catch (err) {
        console.log(err)
    }
}

module.exports = {
    checkRestuarantExist
}