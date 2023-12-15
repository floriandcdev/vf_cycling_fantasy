const mysql = require("mysql2/promise");
const config = require("../config/mysqlConfig.json");

const createLeague = async (req, res) => {
    let connection;

    try {
        connection = await mysql.createConnection(config);

        let leagueId;
        let leagueExists = false;

        do {
            leagueId = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;

            const checkQuery = "SELECT leagueId FROM leagues WHERE leagueId = ?";
            const [rows] = await connection.execute(checkQuery, [leagueId]);

            leagueExists = rows.length > 0;
        } while (leagueExists);

        let leagueLabel = "Ligue n° : " + leagueId;

        const insertQuery = "INSERT INTO leagues (userId, leagueId, leagueLabel) VALUES (0, ?, ?)";
        await connection.execute(insertQuery, [leagueId, leagueLabel]);

        res.status(201).json({ leagueId });
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