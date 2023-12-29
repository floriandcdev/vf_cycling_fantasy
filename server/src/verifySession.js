const jwt = require("jsonwebtoken");

const verifySession = async (req, res) => {
    const token = req.cookies.accessToken;

    if (!token) {
        return res.status(401).json({ message: "Non authentifié" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
        if (err) {
            return res.status(403).json({ message: "Session invalide" });
        }

        res.status(200).json({ isAuthenticated: true, userId: decodedToken.userId });
    });
};

module.exports = verifySession;