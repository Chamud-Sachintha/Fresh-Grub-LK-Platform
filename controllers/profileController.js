const { QueryTypes,Sequelize } = require('sequelize');
const sequelize = new Sequelize('postgres://postgres:root@localhost:5432/fresh_grub_lk')

const db = require("../models");

const Profile = db.Profile

const addNewProfileDetails = async (req, res, next) => {
    try {
        const data = {
            userId: req.body.userId,
            fullName: req.body.fullName,
            emailAddress: req.body.emailAddress,
            mobileNumber: req.body.mobileNumber,
            location: req.body.location,
            lat: req.body.lat,
            long: req.body.long,
            profileImage: req.body.profileImage,
            role: req.body.role
        }

        const createProfileImageDetails = await Profile.create(data);

        if (createProfileImageDetails) {
            res.send(createProfileImageDetails);
        }
    } catch (err) {
        console.log(err);
    }
}

const getProfileDetailsByUserId = async (req, res, next) => {
    try {
        const userId = req.query.userId;
        const userRole = req.query.role;

        const getProfileDetails = await Profile.findAll({
            where: {
                userId: userId,
                role: userRole
            }
        })

        if (getProfileDetails) {
            res.send(getProfileDetails);
        }
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    addNewProfileDetails,
    getProfileDetailsByUserId
}