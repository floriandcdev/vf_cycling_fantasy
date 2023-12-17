const mysql = require("mysql2/promise");
const config = require("../config/mysqlConfig.json");

const createLeague = async (req, res) => {
    const leagueId = req.params.leagueId;

    let connection;

    try {
        connection = await mysql.createConnection(config);

        const checkQuery = "SELECT leagueId FROM leagues WHERE leagueId = ?";
        const [rows] = await connection.execute(checkQuery, [leagueId]);

        if (league.length > 0) {
            return res.status(404).json({ message: "La ligue existe déjà" });
        }

        const insertQuery = "INSERT INTO leagues (userId, leagueId) VALUES (0, ?)";
        await connection.execute(insertQuery, [leagueId]);

        res.status(201).json({ message: "Ligue créée" });
    } catch (error) {
        console.error("Erreur lors de la création de la ligue:", error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    } finally {
        if (connection) {
            await connection.end();
        }
    }
};

module.exports = createLeague;