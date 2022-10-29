const db = require("../models")

const Category = db.Category
const Eatable = db.Eatable

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

const getAllCategoryByCategoryId = async (req, res, next) => {
    try {
        const getSingleCategoryByCategoryId = await Category.findAll({
            where:{
                id: req.query.categoryId
            }
        })

        if (getSingleCategoryByCategoryId) {
            res.send(getSingleCategoryByCategoryId)
        }
    } catch (err) {
        console.log(err);
    }
}

const updateCategoryDetailsByCategoryId = async (req, res, next) => {
    try {
        const categoryId = req.query.categoryId;

        const updateCategoryDetailsByCategoryId = await Category.update(
            {
                sellerId: req.body.sellerId,
                categoryName: req.body.categoryName,
                categoryDescription: req.body.categoryDescription,
                categoryImage: req.body.categoryImage
            },
            {
                where: {
                    id: categoryId
                }
            }
        )

        if (updateCategoryDetailsByCategoryId) {
            res.send("Operation Complete.");
        }
    } catch (err) {
        console.log(err);
    }
}

const deleteCategorydetailsByCategoryId = async (req, res, next) => {
    try {
        const categoryId = req.query.categoryId;

        const deleteCategoryDetailsByCategoryId = await Category.destroy({
            where: {
                id: categoryId
            }
        })

        if (deleteCategoryDetailsByCategoryId) {
            const updateCascadeEatableCategories = await Eatable.update(
                {
                    categoryId: 0
                },
                {
                    where: {
                        categoryId: categoryId
                    }
                }
            )

            if (updateCascadeEatableCategories) {
                res.send("Operation Coimplete.");
            }
        }
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    addNewCategory,
    getAllCategories,
    getAllCategoryBySellerId,
    getAllCategoryByCategoryId,
    updateCategoryDetailsByCategoryId,
    deleteCategorydetailsByCategoryId
}