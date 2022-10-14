const express = require('express');
const models = require('../models');

const User = models.Customer;

const saveUser = async (req, res, next) => {
    try {
        const emailAddress = await User.findOne({
            where: {
                emailAddress: req.body.emailAddress
            }
        });

        if (emailAddress) {
            return res.json(409).send("Email Already Taken.");
        }

        next();
    } catch (err) {
        console.log(err);
    }
}

module.exports = { saveUser };