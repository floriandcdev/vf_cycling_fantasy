const mysql = require("mysql2/promise");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const config = require("../config/mysqlConfig.json");

const signUp = async (req, res) => {
    let connection;

    try {
        connection = await mysql.createConnection(config);

        const { email, password, pseudo, name, nationality, knowledge} = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email et mot de passe sont requis" });
        }

        const emailRegex = /^[\w-.]+@([\w-]+.)+[\w-]{2,4}$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Format de l'email invalide" });
        }

        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ message: "Le mot de passe ne respecte pas les critères de sécurité" });
        }

        const checkEmailQuery = "SELECT email FROM users WHERE email = ?";
        const [existingEmail] = await connection.execute(checkEmailQuery, [email]);

        if (existingEmail.length > 0) {
            return res.status(409).json({ message: "Cet email est déjà utilisé" });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const query = "INSERT INTO users (email, password, pseudo, name, nationality, knowledge, resetToken) VALUES (?, ?, ?, ?, ?, ?, NULL)";
        const [result] = await connection.execute(query, [email, hashedPassword, pseudo, name, nationality, knowledge]);

        const userId = result.insertId;

        const insertWorldTourQuery = "INSERT INTO user_leagues_teams (userId, leagueId, teamId) VALUES (?, 1, 1)";
        await connection.execute(insertWorldTourQuery, [userId]);

        const insertNeoProQuery = "INSERT INTO user_leagues_teams (userId, leagueId, teamId) VALUES (?, 1, 2)";
        await connection.execute(insertNeoProQuery, [userId]);

        const insertRankingWorldTourQuery = "INSERT INTO ranking (userId, name, total_points, position, leagueId, teamId) VALUES (?, ?, 0, 1, 1, 1)";
        await connection.execute(insertRankingWorldTourQuery, [userId, pseudo]);

        const insertRankingNeoProQuery = "INSERT INTO ranking (userId, name, total_points, position, leagueId, teamId) VALUES (?, ?, 0, 1, 1, 2)";
        await connection.execute(insertRankingNeoProQuery, [userId, pseudo]);

        const accessToken = jwt.sign({ userId: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: "strict"
        });

        res.status(201).json({ message: "Utilisateur créé avec succès", userId: userId });
    } catch (error) {
        console.error("Erreur lors de l'enregistrement de l'utilisateur:", error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    } finally {
        if (connection) {
            await connection.end();
        }
    }
};

module.exports = signUp;