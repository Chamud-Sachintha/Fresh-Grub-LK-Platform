const { QueryTypes,Sequelize } = require('sequelize');
const sequelize = new Sequelize('postgres://postgres:root@localhost:5432/fresh_grub_lk')

const db = require("../models");
const Cart = db.Cart;
const CartItem = db.CartItems;

const getAllCartItemsByCustomerAndEachCart = async (req, res, next) => {
    try {
        const userId = req.query.userId;
        const restuarantId = req.query.restuarantId;

        if (userId) {
            const getAllCartItemsByCustomer = await sequelize.query(
                'select * from "public"."Carts" join "public"."CartItems" on "public"."Carts"."id" = "public"."CartItems"."cartId" and "public"."Carts"."userId" = :userId and "public"."Carts"."restuarantId" = :restuarantId join "public"."Eatables" on "public"."Eatables"."id" = "public"."CartItems"."eatableId";',
                {
                    replacements: { userId: userId, restuarantId: restuarantId },
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

const getAllCartsByCustomerId = async (req, res, next) => {
    try {
        const userId = req.query.userId;

        const availableCartsByCustomer = await sequelize.query(
            'SELECT * FROM "public"."Carts" join "public"."Restuarants" ON "public"."Carts"."restuarantId" = "public"."Restuarants"."id" WHERE "public"."Carts"."userId" = :userId',
            {
                replacements: { userId: userId },
                type: QueryTypes.SELECT
            }
        );

        if (availableCartsByCustomer) {
            res.send(availableCartsByCustomer);
        }
    } catch (err) {
        console.log(err);
    }
}

const addSelectedEatablesToCart = async (req, res, next) => {
    try {
        const userId = req.body.userId;
        const restuarantId = req.body.restuarantId;

        if (await validateUserCartExist(userId,restuarantId) === true) {
            await initializeUserCartdetailsTable(userId,restuarantId)
        } 
        const getCartId = await getSelectedCartIdFromUserId(userId,restuarantId)

        const dataValues = {
            cartId: getCartId.dataValues.cartId,
            eatableId: req.body.eatableId,
            quantity: req.body.eatableQuantity
        }

        const createCartItem = await CartItem.create(dataValues)

        if (createCartItem) {
            res.send(createCartItem);
        }
    } catch (err) {
        console.log(err);
    }
}

async function initializeUserCartdetailsTable(validatorId,restuarantId) {
    try {
        const data = {
            userId: validatorId,
            restuarantId: restuarantId
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

async function validateUserCartExist(validatorId,restuarantId) {
    try {
        const getCartDetails = await Cart.findOne({
            where: {
                userId: validatorId,
                restuarantId: restuarantId
            }
        })

        if (getCartDetails === null) {
            return true;
        }
    } catch (err) {
        console.log(err);
    }
}

async function getSelectedCartIdFromUserId(validatorId,restuarantId) {
    try {
        const getCartId = await Cart.findOne({
            attributes: [['id', 'cartId']],
            where:{
                userId: validatorId,
                restuarantId: restuarantId
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
    getAllCartsByCustomerId,
    getAllCartItemsByCustomerAndEachCart
}