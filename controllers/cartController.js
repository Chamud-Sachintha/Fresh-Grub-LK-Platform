const { QueryTypes,Sequelize } = require('sequelize');
const sequelize = new Sequelize('postgres://postgres:root@localhost:5432/fresh_grub_lk')

const db = require("../models");
const Cart = db.Cart;
const CartItem = db.CartItems;

const getAllCartItemsByCustomer = async (req, res, next) => {
    try {
        const userId = req.query.userId;

        if (userId) {
            const getAllCartItemsByCustomer = await sequelize.query(
                'SELECT * FROM "public"."Eatables" JOIN "public"."CartItems" ON "public"."Eatables"."id" = "public"."CartItems"."eatableId" JOIN "public"."Categories" ON "public"."Eatables"."categoryId" = "public"."Categories"."id" JOIN "public"."Carts" ON "public"."Carts"."userId" = :userId',
                {
                    replacements: { userId: userId },
                    type: QueryTypes.SELECT
                }
            );

            if (getAllCartItemsByCustomer) {
                res.send(getAllCartItemsByCustomer);
            }
        }
    } catch (err) {
        console.log(err);
    }
}

const addSelectedEatablesToCart = async (req, res, next) => {
    try {
        const userId = req.body.userId;

        if (await validateUserCartExist(userId) === true) {
            initializeUserCartdetailsTable(userId)
        } else {
            const getCartId = await getSelectedCartIdFromUserId(userId)

            const dataValues = {
                cartId: getCartId.dataValues.cartId,
                eatableId: req.body.eatableId,
                quantity: req.body.eatableQuantity
            }

            const createCartItem = await CartItem.create(dataValues)

            if (createCartItem) {
                res.send(createCartItem);
            }
        }
    } catch (err) {
        console.log(err);
    }
}

async function initializeUserCartdetailsTable(validatorId) {
    try {
        const data = {
            userId: validatorId
        }
        const initializeUserCart = await Cart.create(data)

        if (initializeUserCart) {
            return 200;
        } else {
            return 500;
        }
    } catch (err) {
        console.log(err);
    }
}

async function validateUserCartExist(validatorId) {
    try {
        const getCartDetails = await Cart.findOne({
            where: {
                userId: validatorId
            }
        })

        if (getCartDetails === null) {
            return true;
        }
    } catch (err) {
        console.log(err);
    }
}

async function getSelectedCartIdFromUserId(validatorId) {
    try {
        const getCartId = await Cart.findOne({
            attributes: [['id', 'cartId']],
            where:{
                userId: validatorId
            }
        })

        if (getCartId) {
            return getCartId;
        } else {
            return null
        }
    } catch (err) {
        console.log(err)
    }
}

module.exports = {
    addSelectedEatablesToCart,
    getAllCartItemsByCustomer
}