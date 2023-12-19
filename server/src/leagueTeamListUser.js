const mysql = require("mysql2/promise");
const config = require("../config/mysqlConfig.json");

const leagueTeamListUser = async (req, res) => {
const userId = req.user.userId; 

    let connection;
    try {
        connection = await mysql.createConnection(config);

        const query = `
            SELECT ult.leagueId, ult.teamId, l.leagueLabel
            FROM user_leagues_teams ult
            INNER JOIN leagues l ON ult.leagueId = l.leagueId
            WHERE ult.userId = ?
            ORDER BY ult.leagueId ASC, ult. teamId ASC`;

        const [userleaguesTeam] = await connection.execute(query, [userId]);

        res.status(200).json(userleaguesTeam);
    } catch (error) {
        console.error("Erreur lors de la récupération des ligues de l'utilisateur:", error);
        res.status(500).send("Erreur interne du serveur");
    } finally {
        if (connection) {
            await connection.end();
        }
    }
};

module.exports = leagueTeamListUser;