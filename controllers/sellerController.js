const { QueryTypes, Sequelize } = require('sequelize');
const sequelize = new Sequelize('postgres://postgres:root@localhost:5432/fresh_grub_lk')
const Op = Sequelize.Op;

const bycrypt = require('bcrypt')
const db = require("../models")
const jwt = require('jsonwebtoken');
const { eatables } = require('../models');

const Seller = db.Seller
const Restuarant = db.Restuarant
const Eatable = db.Eatable;

const signUp = async (req, res, next) => {
    try {
        const salt = bycrypt.genSaltSync(10, "a");
        const { emailAddress, password } = req.body;
        const data = {
            emailAddress,
            password: await bycrypt.hash(JSON.stringify(password), salt),
        }

        const seller = await Seller.create(data)

        if (seller) {
            let token = jwt.sign({ id: seller.id }, process.env.secretKey, {
                expiresIn: 1 * 24 * 60 * 60 * 1000,
            });

            res.cookie("jwt", token, { maxAge: 1 * 24 * 60 * 60, httpOnly: true });
            console.log("user", JSON.stringify(seller, null, 2));
            console.log(token);
            //send users details
            return res.status(201).send(seller);
        } else {
            return res.status(409).send("Details are not correct");
        }
    } catch (err) {
        console.log(err);
    }
}

const login = async (req, res) => {
    try {
        const { emailAddress, password } = req.body;

        //find a user by their email
        const seller = await Seller.findOne({ where: { emailAddress } });

        if (seller) {
            const isSame = await bycrypt.compare(JSON.stringify(password), seller.password);

            if (isSame) {
                let token = jwt.sign({ id: seller.id }, process.env.secretKey, {
                    expiresIn: 1 * 24 * 60 * 60 * 1000,
                });

                //if password matches wit the one in the database
                //go ahead and generate a cookie for the user
                res.cookie("jwt", token, { maxAge: 1 * 24 * 60 * 60, httpOnly: true });
                console.log("user", JSON.stringify(seller, null, 2));
                console.log(token);
                //send user data
                return res.status(201).send(seller);
            } else {
                return res.status(401).send("Authentication failed");
            }
        } else {
            return res.status(401).send("Authentication failed");
        }
    } catch (err) {
        console.log(err);
    }
}

const updateRestuarantrByRestuarantId = async (req, res, next) => {
    try {
        const restuarantId = req.query.restuarantId;

        const updateRestuarantDetails = await Restuarant.update(
            {
                sellerId: parseInt(req.body.sellerId),
                restuarantName: req.body.restuarantName,
                description: req.body.restuarantDescription,
                imageFile: req.body.featuredImage,
                addressLineFirst: req.body.firstAddressLine,
                addressLineSecond: req.body.secondAddressLine,
                location: req.body.location,
                landMobile: req.body.lanLine,
                frontMobile: req.body.mobileNumber
            },
            {
                where:
                {
                    id: restuarantId
                }
            }
        )

        if (updateRestuarantDetails) {
            res.send(updateRestuarantDetails);
        }
    } catch (err) {
        console.log(err);
    }
}

const deleteSelectedRestuarantByRestuarantId = async (req, res, next) => {
    try {
        const restuarantId = req.query.restuarantId;

        const deleteRestuarantById = await Restuarant.destroy({
            where: {
                id: restuarantId
            }
        })

        if (deleteRestuarantById) {
            const deleteCascadeEatablesByRestuarantId = await sequelize.query(
                'DELETE FROM "public"."Eatables" WHERE "public"."Eatables"."id" IN (SELECT "public"."RetuarantEatabls"."eatableId" FROM "public"."RetuarantEatabls" WHERE "public"."RetuarantEatabls"."restuarantId" = :restuarantId)',
                {
                    replacements: { restuarantId: restuarantId },
                    type: QueryTypes.DELETE
                }
            );

            const deleteRelationTableValuesByRestuarantId = await sequelize.query(
                'DELETE FROM "public"."RetuarantEatabls" WHERE "public"."RetuarantEatabls"."restuarantId" = :restuarantId',
                {
                    replacements: { restuarantId: restuarantId },
                    type: QueryTypes.DELETE
                }
            );

            if (deleteCascadeEatablesByRestuarantId && deleteRelationTableValuesByRestuarantId) {
                return res.status(201).send("Operation Complete Successfully.");
            }
        }
    } catch (err) {
        console.log(err);
    }
}

const addRestuarant = async (req, res, next) => {
    try {
        const data = {
            sellerId: parseInt(req.body.sellerId),
            restuarantName: req.body.restuarantName,
            description: req.body.restuarantDescription,
            imageFile: req.body.featuredImage,
            addressLineFirst: req.body.firstAddressLine,
            addressLineSecond: req.body.secondAddressLine,
            location: req.body.location,
            lat: req.body.lat,
            long: req.body.long,
            landMobile: req.body.lanLine,
            frontMobile: req.body.mobileNumber
        }

        console.log(data);

        const restuarant = await Restuarant.create(data);

        if (restuarant) {
            return res.status(201).send(restuarant);
        } else {
            return res.status(409).send("Details are not correct");
        }
    } catch (err) {
        console.log(err);
    }
}

const getListOfRestuarantsBySellerId = async (req, res, next) => {
    try {
        const restuarantsList = await Restuarant.findAll({
            where: {
                sellerId: req.query.sellerId
            }
        })

        if (restuarantsList) {
            res.send(restuarantsList);
        }
    } catch (err) {
        console.log(err)
    }
}

const getListOfRestuarants = async (req, res, next) => {
    try {
        const latitude = req.query.lat;
        const longitude = req.query.long;
        const getListOfRestuarants = await Restuarant.findAll();

        if (getListOfRestuarants) {
            const data = checkDistanceBetWeenRestuarantAndCustomer(getListOfRestuarants, latitude, longitude)
            
            if (data) {
                res.send(data);
            }
        }
    } catch (err) {
        console.log(err);
    }
}

function checkDistanceBetWeenRestuarantAndCustomer(getListOfRestuarants, latitude, longitude) {
    try {
        const data = []
        for (let eachRestuarant = 0; eachRestuarant < getListOfRestuarants.length; eachRestuarant++) {
            const lat1 = getListOfRestuarants[eachRestuarant].lat;
            const long1 = getListOfRestuarants[eachRestuarant].long;
            const lat2 = latitude;
            const long2 = longitude;

            const distance = getDistanceBetweenTwoPlaces(lat1, long1, lat2, long2);

            if (distance <= 2) {
                data.push(getListOfRestuarants[eachRestuarant]);
            }
        }

        return data;
    } catch (err) {
        console.log(err);
    }
}

function getDistanceBetweenTwoPlaces(lat1, long1, lat2, long2) {
    long1 = long1 * Math.PI / 180;
    long2 = long2 * Math.PI / 180;
    lat1 = lat1 * Math.PI / 180;
    lat2 = lat2 * Math.PI / 180;

    // Haversine formula
    let dlon = long2 - long1;
    let dlat = lat2 - lat1;
    let a = Math.pow(Math.sin(dlat / 2), 2)
        + Math.cos(lat1) * Math.cos(lat2)
        * Math.pow(Math.sin(dlon / 2), 2);

    let c = 2 * Math.asin(Math.sqrt(a));

    // Radius of earth in kilometers. Use 3956
    // for miles
    let r = 6371;

    // calculate the result
    return (c * r);
}

const findRestuarantByRestuarantId = async (req, res, next) => {
    try {
        const restuarantDetails = await Restuarant.findAll({
            where: {
                id: req.query.restuarantId
            }
        })

        if (restuarantDetails) {
            return res.send(restuarantDetails)
        }
    } catch (err) {
        console.log(err);
    }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

const findRestuarantsBySearchType = async (req, res, next) => {
    try {
        const searchType = req.query.searchType;
        const searchValue = capitalizeFirstLetter(req.query.searchValue);

        if (searchType === "1") {
            const restuarantResultSet = await Restuarant.findAll({
                where: {
                    restuarantName: {
                        [Op.like]: `%${searchValue}%` 
                    }
                }
            })

            if (restuarantResultSet) {
                res.send(restuarantResultSet)
            }
        }
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    signUp,
    login,
    addRestuarant,
    getListOfRestuarants,
    getListOfRestuarantsBySellerId,
    findRestuarantByRestuarantId,
    updateRestuarantrByRestuarantId,
    deleteSelectedRestuarantByRestuarantId,
    findRestuarantsBySearchType
};