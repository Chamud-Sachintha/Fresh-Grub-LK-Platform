const { QueryTypes,Sequelize } = require('sequelize');
const { seller } = require('../models');
const sequelize = new Sequelize('postgres://postgres:root@localhost:5432/fresh_grub_lk')
const Op = Sequelize.Op;
const db = require("../models")

const Eatable = db.Eatable
const RestuarantEatble = db.RetuarantEatabl

const getEatablesByOrderId = async (req, res, next) => {
    try {
        const eatableDetailsByOrderId = await sequelize.query(
            'SELECT * FROM "public"."Eatables" JOIN "public"."OrderDetails" ON "public"."Eatables"."id" = "public"."OrderDetails"."eatableId" JOIN "public"."Orders" ON "public"."Orders"."id" = "public"."OrderDetails"."orderId" WHERE "public"."OrderDetails"."orderId" = :orderId',
            {
                replacements: { orderId: req.query.orderId },
                type: QueryTypes.SELECT
            }
        )

        if (eatableDetailsByOrderId) {
            res.send(eatableDetailsByOrderId);
        }
    } catch (err) {
        console.log(err);
    }
}

const addNewEatable = async (req, res, next) => {
    try {
        const getRequestData = {
            categoryId: req.body.selectedCategory,
            eatableName: req.body.eatableName,
            eatableDescription: req.body.eatableDescription,
            eatablePrice: req.body.eatablePrice,
            eatableFeaturedImage: req.body.eatableFeaturedImage
        }

        const postCategoryDetails = await Eatable.create(getRequestData)

        if (postCategoryDetails) {
            if (createRestuarantEatableAssociate(postCategoryDetails, req.body.selectedRestuarant)) {
                res.send(postCategoryDetails)
            }
        }
    } catch (err) {
        console.log(err);
    }
}

async function createRestuarantEatableAssociate(postCategoryDetails, restuarantId) {
    console.log(postCategoryDetails);

    try {
        const getEatableData = await Eatable.findOne({
            where: {
                id: postCategoryDetails.id
            }
        })

        if (getEatableData) {
            const createAssociateData = {
                eatableId: postCategoryDetails.id,
                restuarantId: restuarantId
            }

            const postAssociateData = await RestuarantEatble.create(createAssociateData)

            if (postAssociateData) {
                return true;
            }
        }
    } catch (err) {
        console.log(err);
    }
}

const getAllEatablesBySellerId = async (req, res, next) => {
    try {
        const getAllEatablesBySeller = await sequelize.query(
            'SELECT "public"."Eatables"."id","public"."Eatables"."eatableName","public"."Eatables"."eatablePrice","public"."Eatables"."eatableDescription","public"."Eatables"."eatableFeaturedImage","public"."Categories"."categoryName"  FROM "public"."Eatables" join "public"."Categories" ON "public"."Eatables"."categoryId" =  "public"."Categories"."id" WHERE "public"."Eatables"."categoryId" IN (SELECT "public"."Categories"."id" FROM "public"."Categories" WHERE "public"."Categories"."sellerId" = :sellerId)',
            {
                replacements: { sellerId: req.query.sellerId },
                type: QueryTypes.SELECT
            }
        );

        if (getAllEatablesBySeller) {
            res.send(getAllEatablesBySeller);
        }
    } catch (err) {
        console.log(err);
    }
}

const getEatablesBelongsToRestuarant = async (req, res, next) => {
    try {
        const getEatableDetailsForRestuarant = await sequelize.query(
            'SELECT * FROM "public"."Eatables" where "public"."Eatables"."id" IN (SELECT "public"."RetuarantEatabls"."eatableId" FROM "public"."RetuarantEatabls" WHERE "public"."RetuarantEatabls"."restuarantId" = :restuarantId)',
            {
                replacements: { restuarantId: req.query.restuarantId },
                type: QueryTypes.SELECT
            }
        )

        if (getEatableDetailsForRestuarant) {
            res.send(getEatableDetailsForRestuarant);
        }
    } catch (err) {
        console.log(err);
    }
}

const getEatableDetailsByEatableId = async (req, res, next) => {
    try {
        const getSelectedEatableDetails = await Eatable.findAll({
            where: {
                id: req.query.eatableId
            }
        })

        if (getSelectedEatableDetails) {
            res.send(getSelectedEatableDetails);
        }
    } catch (err) {
        console.log(err);
    }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

const getEatableBySearchType = async (req, res, next) => {
    try {
        const sellerId = req.query.sellerId;
        const searchType = req.query.searchType;
        const searchValue = capitalizeFirstLetter(req.query.searchValue);

        if (searchType === "1") {
            const getEatableResultSet = await sequelize.query(
                'SELECT * FROM "public"."Eatables" JOIN "public"."Categories" ON "public"."Eatables"."categoryId" = "public"."Categories"."id" WHERE "public"."Categories"."sellerId" = :sellerId AND "public"."Eatables"."eatableName" LIKE :searchValue',
                {
                    replacements: { sellerId: sellerId, searchValue: `%${searchValue}%` },
                    type: QueryTypes.SELECT
                }
            )

            if (getEatableResultSet) {
                res.send(getEatableResultSet)
            }
        } else if (searchType === "2") {
            const getEatableResultSet = await sequelize.query(
                'SELECT * FROM "public"."Eatables" JOIN "public"."RetuarantEatabls" ON "public"."Eatables"."id" = "public"."RetuarantEatabls"."eatableId" WHERE "public"."Eatables"."id" IN (SELECT "public"."RetuarantEatabls"."eatableId" FROM "public"."RetuarantEatabls" WHERE "public"."RetuarantEatabls"."restuarantId" = :restuarantId)',
                {
                    replacements: { restuarantId: searchValue },
                    type: QueryTypes.SELECT
                }
            )

            if (getEatableResultSet) {
                res.send(getEatableResultSet)
            }

        } else if (searchType === "3") {
            const getEatableResultSet = await sequelize.query(
                'SELECT * FROM "public"."Eatables" JOIN "public"."Categories" ON "public"."Eatables"."categoryId" = "public"."Categories"."id" WHERE "public"."Categories"."id" = :categoryId',
                {
                    replacements: { categoryId: searchValue },
                    type: QueryTypes.SELECT
                }
            )

            if (getEatableResultSet) {
                res.send(getEatableResultSet)
            }
        } else {

        }
    } catch (err) {
        console.log(err);
    }
}

const getEatableByCustomerSearchType = async (req, res, next) => {
    try {
        const restuarantId = req.query.restuarantId;
        const searchCategory = req.query.searchCategory;
        const searchValue = req.query.searchValue;

        const getEatableResultSet = await sequelize.query(
            'SELECT * FROM "public"."Eatables" JOIN "public"."Categories" ON "public"."Eatables"."categoryId" = "public"."Categories"."id" WHERE "public"."Categories"."id" = :categoryId AND "public"."Eatables"."eatableName" LIKE :eatableName AND "public"."Eatables"."id" IN (select "public"."RetuarantEatabls"."eatableId" FROM "public"."RetuarantEatabls" WHERE "public"."RetuarantEatabls"."restuarantId" = :restuarantId)',
            {
                replacements: { categoryId: searchCategory, eatableName: `%${searchValue}%`, restuarantId: restuarantId },
                type: QueryTypes.SELECT
            }
        )

        if (getEatableResultSet) {
            res.send(getEatableResultSet)
        }
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    addNewEatable,
    getAllEatablesBySellerId,
    getEatablesBelongsToRestuarant,
    getEatableDetailsByEatableId,
    getEatablesByOrderId,
    getEatableByCustomerSearchType,
    getEatableBySearchType
}