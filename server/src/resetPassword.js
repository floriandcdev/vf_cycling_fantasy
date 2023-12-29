const bcrypt = require("bcrypt");
const mysql = require("mysql2/promise");
const config = require("../config/mysqlConfig.json");

const resetPassword = async (req, res) => {
    const { token, password } = req.body
    
    let connection;

    try {
        connection = await mysql.createConnection(config);

        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ message: "Le mot de passe ne respecte pas les critères de sécurité" });
        }

        const tokenQuery = "SELECT userId FROM users WHERE resetToken = ?";
        const [users] = await connection.execute(tokenQuery, [token]);

        if (users.length === 0) {
            return res.status(400).json({ message: "Jeton de réinitialisation invalide ou expiré." });
        }

        const userId = users[0].userId;

        const hashedPassword = await bcrypt.hash(password, 10);

        const updateQuery = "UPDATE users SET password = ?, resetToken = NULL WHERE userId = ?";
        await connection.execute(updateQuery, [hashedPassword, userId]);

        res.status(200).json({ message: "Mot de passe réinitialisé avec succès." });
    } catch (error) {
        console.error("Erreur lors de la réinitialisation du mot de passe:", error);
        res.status(500).json({ message: "Erreur interne du serveur." });
    } finally {
        if (connection) {
            await connection.end();
        }
    }
};

module.exports = resetPassword;