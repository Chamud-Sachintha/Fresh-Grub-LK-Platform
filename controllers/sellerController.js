const { QueryTypes,Sequelize } = require('sequelize');
const sequelize = new Sequelize('postgres://postgres:root@localhost:5432/fresh_grub_lk')

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
                city: req.body.city,
                state: req.body.state,
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
            city: req.body.city,
            state: req.body.state,
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

const findRestuarantsBySearchType = async (req, res, next) => {
    try {
        const searchType = req.query.searchType;

        if (searchType === "") {
            
        }
    } catch (err) {
        console.log(err)
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
        const getListOfRestuarants = await Restuarant.findAll();

        if (getListOfRestuarants) {
            return res.send(getListOfRestuarants)
        }
    } catch (err) {
        console.log(err);
    }
}

const findRestuarantByRestuarantId = async (req, res, next) => {
    try {   
        const restuarantDetails = await Restuarant.findAll({
            where:{
                id: req.query.restuarantId
            }
        })

        if (restuarantDetails) {
            return res.send(restuarantDetails)
        }
    } catch(err) {
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
    findRestuarantsBySearchType,
    deleteSelectedRestuarantByRestuarantId
};