const { QueryTypes,Sequelize } = require('sequelize');
const sequelize = new Sequelize('postgres://postgres:root@localhost:5432/fresh_grub_lk')

const bcrypt = require("bcrypt");
const db = require("../models");
const jwt = require("jsonwebtoken");

const Customer = db.Customer;
const Rating = db.Rating;

//signing a user up
//hashing users password before its saved to the database with bcrypt
const signup = async (req, res) => {
    try {
        const salt = bcrypt.genSaltSync(10, "a");
        const { emailAddress, password, userRole } = req.body;
        const data = {
            emailAddress,
            password: await bcrypt.hash(JSON.stringify(password), salt)
        };
        //saving the user
        const customer = await Customer.create(data);

        //if user details is captured
        //generate token with the user's id and the secretKey in the env file
        // set cookie with the token generated
        if (customer) {
            let token = jwt.sign({ id: customer.id }, process.env.secretKey, {
                expiresIn: 1 * 24 * 60 * 60 * 1000,
            });

            res.cookie("jwt", token, { maxAge: 1 * 24 * 60 * 60, httpOnly: true });
            console.log("user", JSON.stringify(customer, null, 2));
            console.log(token);
            //send users details
            return res.status(201).send(customer);
        } else {
            return res.status(409).send("Details are not correct");
        }
    } catch (error) {
        console.log(error);
    }
};


//login authentication

const login = async (req, res) => {
    try {
        const { emailAddress, password } = req.body;
        // console.log(req.query.emailAddress);

        //find a user by their email
        const customer = await Customer.findOne({ where: { emailAddress } });

        //if user email is found, compare password with bcrypt
        if (customer) {
            console.log(JSON.stringify(password));
            const isSame = await bcrypt.compare(JSON.stringify(password), customer.password);

            //if password is the same
            //generate token with the user's id and the secretKey in the env file
            if (isSame) {
                let token = jwt.sign({ id: customer.id }, process.env.secretKey, {
                    expiresIn: 1 * 24 * 60 * 60 * 1000,
                });

                //if password matches wit the one in the database
                //go ahead and generate a cookie for the user
                res.cookie("jwt", token, { maxAge: 1 * 24 * 60 * 60, httpOnly: true });
                console.log("user", JSON.stringify(customer, null, 2));
                console.log(token);
                //send user data
                return res.status(201).send(customer);
            } else {
                return res.status(401).send("Authentication failed");
            }
        } else {
            return res.status(401).send("Authentication failed");
        }
    } catch (error) {
        console.log(error);
    }
};

const getCategoriesOfSelectedRestuarant = async (req, res, next) => {
    try {
        const getcategoriesOfrestuarant = await sequelize.query(
            'SELECT * FROM "public"."Categories" WHERE "public"."Categories"."id" IN (SELECT DISTINCT "public"."Eatables"."categoryId" FROM "public"."Eatables" WHERE "public"."Eatables"."id" IN (SELECT "public"."RetuarantEatabls"."eatableId" FROM "public"."RetuarantEatabls" WHERE "public"."RetuarantEatabls"."restuarantId" = :restuarantId))',
            {
                replacements: { restuarantId: req.query.restuarantId },
                type: QueryTypes.SELECT
            }
        );

        if (getcategoriesOfrestuarant) {
            res.send(getcategoriesOfrestuarant);
        }
    } catch (err) {
        console.log(err);
    }
}

const getAssignedDriverForOrderByOrderId = async (req, res, next) => {
    try {
        const orderId = req.query.orderId;

        const getDriverDetails = await sequelize.query(
            'SELECT * FROM "public"."DriverAssigns" d JOIN "public"."Profiles" q ON d."userId" = q."userId" where d."orderId" = :orderId AND d."orderDeliveryStatus" = :orderStatus',
            {
                replacements: { orderId: orderId, orderStatus: 'D' },
                type: QueryTypes.SELECT
            }
        );

        if (getDriverDetails) {
            res.send(getDriverDetails);
        } 
    } catch (err) {
        console.log(err);
    }
}

const provideRatingtByTypeAndId = async (req, res, next) => {
    try {
        const ratingValue = req.body.ratingValue;
        const ratingTypeSec = req.body.ratingTypeSec;
        const ratingType = req.body.ratingType;
        const orderId = req.body.orderId;

        const data = {
            ratingType: ratingType,
            ratingTypeSec: ratingTypeSec,
            ratingValue: ratingValue,
            orderId: orderId
        }

        const createRatingForRestuarant = await Rating.create(data);

        if (createRatingForRestuarant) {
            res.send(createRatingForRestuarant);
        }
    } catch (err) {
        console.log(err);
    }
}

const isProvideRatingForOrder = async (req, res, next) => {
    try {
        const ordereId = req.query.orderId;
        const ratingType = req.query.ratingType;

        const getRatingData = await Rating.findAll({
            where: {
                orderId: ordereId,
                ratingType: ratingType
            }
        })

        if (getRatingData.length == 0) {
            return res.send(true);
        } else {
            return res.send(false);
        }
    } catch (err) {
        console.log(err);
    }
}

const test = async (req, res, next) => {
    res.send("hellow");
}

module.exports = {
    signup,
    login,
    test,
    getCategoriesOfSelectedRestuarant,
    getAssignedDriverForOrderByOrderId,
    provideRatingtByTypeAndId,
    isProvideRatingForOrder
};