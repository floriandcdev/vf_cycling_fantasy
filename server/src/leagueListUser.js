const mysql = require("mysql2/promise");
const config = require("../config/mysqlConfig.json");

const leagueListUser = async (req, res) => {
const userId = req.user.userId; 

    let connection;
    try {
        connection = await mysql.createConnection(config);

        const query = `
            SELECT l.leagueId
            FROM leagues l
            WHERE l.userId = ?`;

        const [leagues] = await connection.execute(query, [userId]);

        res.status(200).json(leagues);
    } catch (error) {
        console.error("Erreur lors de la récupération des ligues de l'utilisateur:", error);
        res.status(500).send("Erreur interne du serveur");
    } finally {
        if (connection) {
            await connection.end();
        }
    }
};

module.exports = leagueListUser;