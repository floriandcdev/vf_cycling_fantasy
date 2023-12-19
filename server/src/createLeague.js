const mysql = require("mysql2/promise");
const config = require("../config/mysqlConfig.json");

const createLeague = async (req, res) => {
    const leagueLabel = req.params.leagueLabel;

    let connection;

    try {
        connection = await mysql.createConnection(config);

        const checkQuery = "SELECT leagueId FROM leagues WHERE leagueLabel = ?";
        const [leagueExist] = await connection.execute(checkQuery, [leagueLabel]);

        if (leagueExist.length > 0) {
            return res.status(403).json({ message: "La ligue existe déjà" });
        }

        const insertQuery = "INSERT INTO leagues (leagueLabel) VALUES (?)";
        const [insertResult] = await connection.execute(insertQuery, [leagueLabel]);
        
        const leagueId = insertResult.insertId;

        const selectQuery = "SELECT * FROM leagues WHERE leagueId = ?";
        const [leagueDetails] = await connection.execute(selectQuery, [leagueId]);
        

        if (leagueDetails.length > 0) {
            res.status(201).json({ message: "Ligue créée", league: leagueDetails[0] });
        } else {
            console.error("Erreur lors de la récupération de la ligue:", error);
            res.status(500).json({ message: "Erreur interne du serveur" });
        }
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