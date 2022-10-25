const { QueryTypes,Sequelize } = require('sequelize');
const sequelize = new Sequelize('postgres://postgres:root@localhost:5432/fresh_grub_lk')

const db = require("../models");
const Order = db.Order;
const OrderDetails = db.OrderDetails;
const Cart = db.Cart;
const CartItem = db.CartItems;

const getEachEatablesByOrderedRestuarant = async (req, res, next) => {
    try {
        const userId = req.query.userId;
        const restuarantId = req.query.restuarantId;

        const getSelectedEatablesByRestuarant = sequelize.query(
            'select * from "public"."Eatables" join "public"."RetuarantEatabls" on "public"."Eatables"."id" = "public"."RetuarantEatabls"."eatableId" join "public"."OrderDetails" on "public"."RetuarantEatabls"."eatableId" = "public"."OrderDetails"."eatableId" join "public"."Orders" on "public"."Orders"."id" = "public"."OrderDetails"."orderId" where "public"."Orders"."userId" = :userId and "public"."Orders"."restuarantId" = :restuarantId',
            {
                replacements: { userId: userId, restuarantId: restuarantId },
                type: QueryTypes.SELECT
            }
        );

        if (getSelectedEatablesByRestuarant) {
            res.send(getSelectedEatablesByRestuarant)
        }
    } catch (err) {
        console.log(err);
    }
}

const getOrderRequestsByEachSeller = async (req, res, next) => {
    try {
        const sellerId = req.query.sellerId;

        const getAllEatablesBySeller = await sequelize.query(
            'SELECT DISTINCT("public"."Restuarants"."restuarantName"),"public"."Restuarants"."imageFile", "public"."Orders"."subTotal", "public"."Orders"."orderStatus", "public"."Restuarants"."id" AS "RestuarantId" FROM "public"."Orders" join "public"."OrderDetails" ON "public"."Orders"."id" = "public"."OrderDetails"."orderId" JOIN "public"."RetuarantEatabls" ON "public"."RetuarantEatabls"."eatableId" = "public"."OrderDetails"."eatableId" JOIN "public"."Restuarants" ON "public"."Restuarants"."id" = "public"."RetuarantEatabls"."restuarantId" WHERE "public"."Restuarants"."sellerId" = :sellerId',
            {
                replacements: { sellerId: sellerId },
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

const getAllOrdersByCustomerId = async (req, res, next) => {
    try {
        const selectedOrderDetails = await Order.findAll({
            where: {
                userId: req.query.userId
            }
        })

        if (selectedOrderDetails) {
            res.send(selectedOrderDetails)
        }
    } catch (err) {
        console.log(err);
    }
}

const placeNewOrderDetailsByCustomer = async (req, res, next) => {
    try {
        const userId = req.body.userId;
        const subTotal = req.body.subTotal;
        const orderStatus = req.body.orderStatus;
        const restuarantId = req.body.restuarantId;

        if (await initializeNewOrderPlacement(userId, subTotal, orderStatus, restuarantId)) {
            const getOrderId = await getSelectedOrderIdFromUserId(userId,restuarantId)
            const cartItemList =  req.body.cartItemsList

            for(let i = 0; i < cartItemList.length; i++) {
                const dataSet = {
                    orderId: getOrderId.dataValues.orderId,
                    eatableId: cartItemList[i].eatableId,
                    quantity: cartItemList[i].eatableQuantity,
                    total: cartItemList[i].total
                }
    
                const placeOrderDetails = await OrderDetails.create(dataSet)
    
                if (placeOrderDetails) {
                    const getCartId = await getSelectedCartIdFromUserId(userId,restuarantId)

                    if (getCartId) {
                        const deleteCartItemsByCartId = await CartItem.destroy({
                            where: {
                                cartId: getCartId.dataValues.cartId,
                            }
                        })

                        const deleteCart = await Cart.destroy({
                            where: {
                                id: getCartId.dataValues.cartId
                            }
                        })

                        if (deleteCartItemsByCartId && deleteCart) {
                            res.send("Operation Complete Successfully.");
                        }
                    }
                }
            }
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

async function initializeNewOrderPlacement(initializeCustomerId, orderTotalAmount, getOrderStatus, restuarantId) {
    try {  
        const data = {
            userId: initializeCustomerId,
            subTotal: orderTotalAmount,
            orderStatus: getOrderStatus,
            restuarantId: restuarantId
        }

        const checkIfOrderExist = await Order.findOne({
            where: {
                userId: initializeCustomerId,
                restuarantId: restuarantId
            }
        });

        console.log(checkIfOrderExist);
        if (checkIfOrderExist != null) {
            const updateTotalAmoutOfOrder = await Order.update(
                { 
                    subTotal: checkIfOrderExist.dataValues.subTotal + orderTotalAmount,
                },
                { 
                    where: 
                    { 
                        userId: initializeCustomerId, 
                        restuarantId: restuarantId 
                    } 
                }
            )

            if (updateTotalAmoutOfOrder) {
                return true
            }

        } else {
            const initializeOrder = await Order.create(data);

            if (initializeOrder) {
                return true
            }
        }
    } catch (err) {
        console.log(err);
    }
}

async function getSelectedOrderIdFromUserId(validatorId,restuarantId) {
    try {
        const getOrderId = await Order.findOne({
            attributes: [['id', 'orderId']],
            where:{
                userId: validatorId,
                restuarantId: restuarantId,
                orderStatus: 'PEN'
            }
        })

        if (getOrderId) {
            return getOrderId;
        } else {
            return null
        }
    } catch (err) {
        console.log(err)
    }
}

module.exports = {
    placeNewOrderDetailsByCustomer,
    getOrderRequestsByEachSeller,
    getEachEatablesByOrderedRestuarant,
    getAllOrdersByCustomerId
}