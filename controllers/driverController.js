const { QueryTypes, Sequelize } = require('sequelize');
const sequelize = new Sequelize('postgres://postgres:root@localhost:5432/fresh_grub_lk')
const Op = Sequelize.Op;

const bycrypt = require('bcrypt')
const db = require("../models")
const jwt = require('jsonwebtoken');

const Driver = db.Driver;

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

module.exports = {
    signUp,
    login
}