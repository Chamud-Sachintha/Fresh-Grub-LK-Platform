const { QueryTypes,Sequelize } = require('sequelize');
const sequelize = new Sequelize('postgres://postgres:root@localhost:5432/fresh_grub_lk')

const db = require("../models");
const Order = db.Order;
const OrderDetails = db.OrderDetails;
const Cart = db.Cart;
const CartItem = db.CartItems;

const placeNewOrderDetailsByCustomer = async (req, res, next) => {
    try {
        const userId = req.body.userId;
        const subTotal = req.body.subTotal;

        if (await initializeNewOrderPlacement(userId, subTotal)) {
            const getOrderId = await getSelectedOrderIdFromUserId(userId)
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
                    const getCartId = await getSelectedCartIdFromUserId(userId)

                    if (getCartId) {
                        const deleteCartItemsByCartId = await CartItem.destroy({
                            where: {
                                cartId: getCartId.dataValues.cartId,
                            }
                        })

                        if (deleteCartItemsByCartId) {
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

async function initializeNewOrderPlacement(initializeCustomerId, orderTotalAmount) {
    try {  
        const data = {
            userId: initializeCustomerId,
            subTotal: orderTotalAmount
        }

        const initializeOrder = await Order.create(data);

        if (initializeOrder) {
            return true
        }
    } catch (err) {
        console.log(err);
    }
}

async function getSelectedOrderIdFromUserId(validatorId) {
    try {
        const getOrderId = await Order.findOne({
            attributes: [['id', 'orderId']],
            where:{
                userId: validatorId
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
    placeNewOrderDetailsByCustomer
}