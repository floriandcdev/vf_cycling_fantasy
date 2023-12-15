const mysql = require("mysql2/promise");
const config = require("../config/mysqlConfig.json");

const racesListUser = async (req, res) => {
    const leagueId = req.params.leagueId;

    let connection;

    try {
        connection = await mysql.createConnection(config);

        const userId = req.user.userId;

        const query = `SELECT r.* FROM races r
                       INNER JOIN user_races u ON r.raceId = u.raceId
                       WHERE u.userId = ? AND u.leagueId = ?
                       ORDER BY r.date_start`;
        const [races] = await connection.execute(query, [userId, leagueId]);

        if (races.length === 0) {
            res.status(404).json({ message: "Course non trouvée" });
        } else {
            res.status(200).json(races);
        }
    } catch (error) {
        console.error("Erreur lors de la récupération de la course:", error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    } finally {
        if (connection) {
            await connection.end();
        }
    }
};

module.exports = racesListUser;