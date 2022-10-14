const jwt = require("jsonwebtoken");

exports.validJWTNeeded = (req, res, next) => {
    if (req.headers['authorization']) {
        try {
            let authorization = req.headers['authorization'].split(' ');
            if (authorization[0] !== 'Bearer') {
                return res.status(401).send();
            } else {
                req.jwt = jwt.verify(authorization[1], process.env.secretKey);
                return next();
            }
        } catch (err) {
            console.log(err);
            return res.status(403).send();
        }
    } else {
        return res.status(401).send();
    }
}; 