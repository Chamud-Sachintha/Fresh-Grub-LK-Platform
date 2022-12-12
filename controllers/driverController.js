const { QueryTypes, Sequelize } = require('sequelize');
const sequelize = new Sequelize('postgres://postgres:root@localhost:5432/fresh_grub_lk')
const Op = Sequelize.Op;

const bycrypt = require('bcrypt')
const db = require("../models")
const jwt = require('jsonwebtoken');

const Driver = db.Driver;
const Customer = db.Customer;
const Order = db.Order;
const Profile = db.Profile;
const DriverAssign = db.DriverAssign;

const signUp = async (req, res, next) => {
    try {
        const salt = bycrypt.genSaltSync(10, "a");
        const { emailAddress, password } = req.body;
        const data = {
            emailAddress,
            password: await bycrypt.hash(JSON.stringify(password), salt),
        }

        const seller = await Driver.create(data)

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
        const seller = await Driver.findOne({ where: { emailAddress } });

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

const assignDriverToOrderRequest = async (req, res, next) => {
    let isDriverAssign = false
    let driverCount = 0
    lat1 = req.query.latitudeOfRestuarant
    long1 = req.query.longitudeOfRestuarant
    orderId = req.query.orderId

    try {
        let driverData = {};
        const getDrivers = await Profile.findAll({
            where: {
                role: "D"
            }
        })

        for (let eachDriver = 0; eachDriver < getDrivers.length; eachDriver++) {
            const distance = getDistanceBetweenTwoPlaces(lat1, long1, getDrivers[eachDriver].dataValues.lat, getDrivers[eachDriver].dataValues.long);
            
            if (distance < 2) {
                driverData = { id: getDrivers[eachDriver].dataValues.userId, distance: distance }
            }
        }

        const sortable = Object.fromEntries(
            Object.entries(driverData).sort(([,a],[,b]) => a-b)
        );

        if (Object.entries(driverData).length > 0) {
            for (let eachDriver = 0; eachDriver < getDrivers.length; eachDriver++) {
                const driverAssignValidator = await DriverAssign.findOne({
                    where: {
                        userId: sortable.id,
                        status: 'A'
                    }
                })
                
                if (driverAssignValidator == null) {
                    const data = {
                        userId: sortable.id,
                        status: "A",
                        orderId: orderId,
                        orderDeliveryStatus: "ND"
                    }
    
                    const assignDriverForDeliver = await DriverAssign.create(data)
    
                    if (assignDriverForDeliver) {
                        isDriverAssign = true
                        updateOrderStatusByRestuarantId(orderId, "D")
                        res.send(assignDriverForDeliver)
                    }
                } else {
                    continue
                }
    
                driverCount += 1;
            }
    
            if (driverCount === getDrivers.length && isDriverAssign == false) {
                driverCount = 0;
                isDriverAssign = false;
                res.send("All Drivers are Busy Please wait...")
            }
        } else {
            res.send("No Drivers Near Restuarant Wait...");
        }
    } catch (err) {
        console.log(err);
    }
}

const getAssignedDriverDetails = async (req, res, next) => {
    try {
        const orderId = req.query.orderId

        const getAssignedDriver = await DriverAssign.findOne({
            where: {
                orderId: orderId
            }
        })

        if (getAssignedDriver) {
            const getDriverDetails = await Profile.findOne({
                where: {
                    userId: getAssignedDriver.dataValues.userId
                }
            })

            res.send(getDriverDetails)
        } else {
            res.send(getAssignedDriver)
        }
    } catch (err) {
        console.log(err);
    }
}

const getAvailableDeliveryRequestsByDriverId = async (req, res, next) => {
    try {
        const driverId = req.query.userId

        const getSelectedEatablesByRestuarant = await sequelize.query(
            'SELECT r."restuarantName", r."location", r."landMobile", o."subTotal", o."orderStatus" , o."id" from "public"."Restuarants" r join "public"."Orders" o on r."id" = o."restuarantId" join "public"."DriverAssigns" d on d."orderId" = o."id" and d."userId" = :userId d."status"= :status',
            {
                replacements: { userId: driverId, status: 'A' },
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

const getDeliveryRequestDetailsByOrderId = async (req, res, next) => {
    try {
        const orderId = req.query.orderId;

        const getDeliveryRequestDetails = await sequelize.query(
            'SELECT r."restuarantName", r."imageFile", r."location", r."landMobile", q."fullName", q."profileImage" as "profileImage", q."location" as "cutomerLocation", q."mobileNumber" FROM "public"."Restuarants" r JOIN "public"."Orders" o ON r."id" = o."restuarantId" join "public"."Profiles" q on o."userId" = q."id" and o."id" = :orderId',
            {
                replacements: { orderId: orderId },
                type: QueryTypes.SELECT
            }
        );

        if (getDeliveryRequestDetails) {
            res.send(getDeliveryRequestDetails)
        } 
    } catch (err) {
        console.log(err);
    }
}

const getDeliveryRequestStatusByOrderId = async (req, res, next) => {
    try {
        const orderId = req.query.orderId;

        const deliveryRequestStatus = await DriverAssign.findOne({
            where: {
                orderId: orderId
            }
        })

        if (deliveryRequestStatus) {
            res.send(deliveryRequestStatus)
        }
    } catch (err) {
        console.log(err);
    }
}

const updateDeliveryStatusByOrderId = async (req, res, next) => {
    try {
        const orderId = req.query.orderId;
        const deliveryStatus = req.query.deliveryStatus;

        if (deliveryStatus == "D") {
            const setDeliveryStatus = await DriverAssign.update(
                {
                    status: "UA"
                },
                {
                    where: {
                        orderId: orderId
                    }
                }
            );
        }

        const updateDeliveryDetailsTable = await DriverAssign.update(
            {
                orderDeliveryStatus: deliveryStatus
            },
            {
                where: {
                    orderId: orderId
                }
            }
        );

        if (updateDeliveryDetailsTable) {
            res.send(updateDeliveryDetailsTable)
        }
    } catch (err) {
        console.log(err);
    }
}

const getCompletedDeleveryRequestByDriverId = async (req, res, next) => {
    try {
        const driverId = req.query.driverId;

        const getCompletedDeliveryRequests = await sequelize.query(
            'SELECT * FROM "public"."DriverAssigns" d JOIN "public"."Orders" o ON d."orderId" = o."id" JOIN "public"."Restuarants" r ON r."id" = o."restuarantId" where d."userId" = :driverId and d."orderDeliveryStatus" = :deliveryStatus',
            {
                replacements: { driverId: driverId, deliveryStatus: 'D' },
                type: QueryTypes.SELECT
            }
        );

        if (getCompletedDeliveryRequests) {
            res.send(getCompletedDeliveryRequests)
        } 
    } catch (err) {
        console.log(err);
    }
}

async function updateOrderStatusByRestuarantId(orderId, orderStatus) {
    try {
        const updateOrderStatus = await Order.update(
            {
                orderStatus: orderStatus
            },
            {
                where: {
                    id: orderId
                }
            }
        );

        if (updateOrderStatus) {
            res.send("Operation Complete Successfully.");
        }
    } catch (err) {
        console.log(err);
    }
}

function getDistanceBetweenTwoPlaces(lat1, long1, lat2, long2) {
    long1 = long1 * Math.PI / 180;
    long2 = long2 * Math.PI / 180;
    lat1 = lat1 * Math.PI / 180;
    lat2 = lat2 * Math.PI / 180;

    // Haversine formula
    let dlon = long2 - long1;
    let dlat = lat2 - lat1;
    let a = Math.pow(Math.sin(dlat / 2), 2)
        + Math.cos(lat1) * Math.cos(lat2)
        * Math.pow(Math.sin(dlon / 2), 2);

    let c = 2 * Math.asin(Math.sqrt(a));

    // Radius of earth in kilometers. Use 3956
    // for miles
    let r = 6371;

    // calculate the result
    return (c * r);
}

module.exports = {
    signUp,
    login,
    assignDriverToOrderRequest,
    getAssignedDriverDetails,
    getAvailableDeliveryRequestsByDriverId,
    getDeliveryRequestDetailsByOrderId,
    updateDeliveryStatusByOrderId,
    getDeliveryRequestStatusByOrderId,
    getCompletedDeleveryRequestByDriverId
}