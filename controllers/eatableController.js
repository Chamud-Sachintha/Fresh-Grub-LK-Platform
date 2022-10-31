const { QueryTypes,Sequelize } = require('sequelize');
const sequelize = new Sequelize('postgres://postgres:root@localhost:5432/fresh_grub_lk')
const db = require("../models")

const Eatable = db.Eatable
const RestuarantEatble = db.RetuarantEatabl

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

module.exports = {
    addNewEatable,
    getAllEatablesBySellerId,
    getEatablesBelongsToRestuarant,
    getEatableDetailsByEatableId
}