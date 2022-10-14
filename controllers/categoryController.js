const db = require("../models")

const Category = db.Category

const addNewCategory = async (req, res, next) => {
    try {
        const getRequestData = {
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

module.exports = {
    addNewCategory
}