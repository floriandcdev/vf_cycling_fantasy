const mysql = require("mysql2/promise");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const config = require("../config/mysqlConfig.json");

const logIn = async (req, res) => {
    let connection;

    try {
        connection = await mysql.createConnection(config);

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email et mot de passe sont requis" });
        }

        const emailRegex = /^[\w-.]+@([\w-]+.)+[\w-]{2,4}$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Format de l'email invalide" });
        }

        const query = "SELECT userId, password FROM users WHERE email = ?";
        const [users] = await connection.execute(query, [email]);

        if (users.length === 0) {
            return res.status(401).json({ message: "Email ou mot de passe incorrect" });
        }

        const user = users[0];
        const passwordIsValid = await bcrypt.compare(password, user.password);

        if (!passwordIsValid) {
            return res.status(401).json({ message: "Email ou mot de passe incorrect" });
        }

        const accessToken = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: "strict"
        });

        res.status(200).json({ message: "Connexion réussie", userId: user.userId });
    } catch (error) {
        console.error("Erreur lors de la connexion de l'utilisateur:", error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    } finally {
        if (connection) {
            await connection.end();
        }
    }
};

module.exports = logIn;