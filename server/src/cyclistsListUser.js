const mysql = require("mysql2/promise");
const config = require("../config/mysqlConfig.json");

const cyclistsListUser = async (req, res) => {
    const leagueId = req.query.selectedLeague;
    const teamId = req.query.selectedTeam;

    let connection;

    try {
        connection = await mysql.createConnection(config);

        const userId = req.user.userId;

        const query = `
            SELECT c.*, uc.cyclistPoints, uc.teamId FROM user_cyclists uc
            INNER JOIN cyclists c ON uc.cyclistId = c.cyclistId
            WHERE uc.userId = ? AND uc.leagueId = ? AND uc.teamId = ?
            ORDER BY c.finalValue DESC`;

        const [cyclists] = await connection.execute(query, [userId, leagueId, teamId]);

        if (cyclists.length === 0) {
            res.status(404).json({ message: "Aucun cycliste trouvé pour cet utilisateur" });
        } else {
            res.status(200).json(cyclists);
        }
    } catch (error) {
        console.error("Erreur lors de la récupération des cyclistes:", error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    } finally {
        if (connection) {
            await connection.end();
        }
    }
};

module.exports = cyclistsListUser;