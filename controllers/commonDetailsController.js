const db = require("../models")

const CommonPrices = db.CommonPrices

const addDeliveryPrice = async (req, res, next) => {
    try {
        // have to code add price details to the db
    } catch (err) {
        console.log(err);
    }
}

const getDeliveryFee = async (req, res, next) => {
    try {
        const deliveryFees = await CommonPrices.findOne({
            where: {
                code: req.query.code
            }
        })

        if (deliveryFees) {
            res.send(deliveryFees);
        }
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    addDeliveryPrice,
    getDeliveryFee
}