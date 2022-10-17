const db = require("../models")

const Category = db.Category

const addNewCategory = async (req, res, next) => {
    try {
        const getRequestData = {
            sellerId: req.body.sellerId,
            categoryName: req.body.categoryName,
            categoryDescription: req.body.categoryDescription,
            categoryImage: req.body.categoryImage
        }

        const categoryDetails = await Category.create(getRequestData)

        if (categoryDetails) {
            res.send(categoryDetails);
        } else {
            res.json(403).send("Error Occured");
        }
    } catch (err) {
        console.log(err);
    }
}

const getAllCategories = async (req, res, next) => {
    try {
        const categoryDetails = await Category.findAll();

        if (categoryDetails) {
            res.send(categoryDetails);
        }
    } catch(err) {
        console.log(err)
    }
}

const getAllCategoryBySellerId = async (req, res, next) => {
    try {
        const categoryDetails = await Category.findAll({
            where: {
                sellerId: req.query.sellerId
            }
        })

        if (categoryDetails) {
            res.send(categoryDetails)
        }
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    addNewCategory,
    getAllCategories,
    getAllCategoryBySellerId
}