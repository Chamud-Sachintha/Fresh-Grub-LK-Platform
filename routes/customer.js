var customer = require('../models').RegModel;
var express = require('express');
var router = express.Router();

const CUSTOMER_ROLE = "C";

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send("Nothing yet");
})

/* POST New Customer Details */
router.post('/add', function (req, res, next) {
  return customer.create({
    emailAddress: req.body.emailAddress,
    userRole: CUSTOMER_ROLE,
    password: req.body.password
  }).then(function (customer) {
    if (customer) {
      res.send(customer);
    } else {
      res.status(400).send('Error in insert new record');
    }
  });
});

module.exports = router;