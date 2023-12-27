const mysql = require("mysql2/promise");
const config = require("../config/mysqlConfig.json");

const createLeague = async (req, res) => {
    const leagueLabel = req.params.leagueLabel;
    const userId = req.user.userId;

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

        const insertWorldTourQuery = "INSERT INTO user_leagues_teams (userId, leagueId, teamId) VALUES (?, ?, 1)";
        await connection.execute(insertWorldTourQuery, [userId, leagueId]);

        const insertNeoProQuery = "INSERT INTO user_leagues_teams (userId, leagueId, teamId) VALUES (?, ?, 2)";
        await connection.execute(insertNeoProQuery, [userId, leagueId]);

        const pseudoQuery = "SELECT pseudo from users WHERE userId = ?";
        const [pseudo] = await connection.execute(pseudoQuery, [userId]);

        const insertRankingWorldTourQuery = "INSERT INTO ranking (userId, name, total_points, position, leagueId, teamId) VALUES (?, ?, 0, 1, ?, 1)";
        await connection.execute(insertRankingWorldTourQuery, [userId, pseudo[0].pseudo, leagueId]);


        const insertRankingNeoProQuery = "INSERT INTO ranking (userId, name, total_points, position, leagueId, teamId) VALUES (?, ?, 0, 1, ?, 2)";
        await connection.execute(insertRankingNeoProQuery, [userId, pseudo[0].pseudo, leagueId]);
       
        if (leagueDetails.length > 0) {
            res.status(201).json({ message: "Ligue créée"});
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