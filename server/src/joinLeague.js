const mysql = require("mysql2/promise");
const config = require("../config/mysqlConfig.json");

const joinLeague = async (req, res) => {
    const leagueLabel = req.params.leagueLabel;
    const userId = req.user.userId;

    let connection;

    try {
        connection = await mysql.createConnection(config);

        const query = "SELECT * FROM leagues WHERE leagueLabel = ?";
        const [league] = await connection.execute(query, [leagueLabel]);

        if (league.length === 0) {
            return res.status(404).json({ message: "Ligue introuvable" });
        }

        const insertWorldTourQuery = "INSERT INTO user_leagues_teams (userId, leagueId, teamId) VALUES (?, ?, 1)";
        await connection.execute(insertWorldTourQuery, [userId, league[0].leagueId]);

        const insertNeoProQuery = "INSERT INTO user_leagues_teams (userId, leagueId, teamId) VALUES (?, ?, 2)";
        await connection.execute(insertNeoProQuery, [userId, league[0].leagueId]);

        const pseudoQuery = "SELECT pseudo from users WHERE userId = ?";
        const [pseudo] = await connection.execute(pseudoQuery, [userId]);

        const insertRankingWorldTourQuery = "INSERT INTO ranking (userId, name, total_points, position, leagueId, teamId) VALUES (?, ?, 0, 1, ?, 1)";
        await connection.execute(insertRankingWorldTourQuery, [userId, pseudo[0].pseudo, league[0].leagueId]);

        const insertRankingNeoProQuery = "INSERT INTO ranking (userId, name, total_points, position, leagueId, teamId) VALUES (?, ?, 0, 1, ?, 2)";
        await connection.execute(insertRankingNeoProQuery, [userId, pseudo[0].pseudo, league[0].leagueId]);

        res.status(200).json({ message: "Ligue existante", league: league[0] });
    } catch (error) {
        console.error("Erreur lors de la jointure à la ligue:", error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    } finally {
        if (connection) {
            await connection.end();
        }
    }
};

module.exports = joinLeague;