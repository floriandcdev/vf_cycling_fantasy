const jwt = require("jsonwebtoken");

const authenticateJWT = (req, res, next) => {

    const token = req.cookies.accessToken;

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }

            req.user = user;
            next();
        });
    } else {
        console.log("Aucun token JWT trouvé dans les cookies");
        res.sendStatus(401);
    }
};

module.exports = authenticateJWT;