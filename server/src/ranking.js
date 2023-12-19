const mysql = require("mysql2/promise");
const config = require("../config/mysqlConfig.json");

const ranking = async (req, res) => {
    const leagueId = req.params.selectedLeague;

    let connection;

    try {
        connection = await mysql.createConnection(config);

        const query = "SELECT r.userId, r.name, r.total_points, r.position, r.teamId FROM ranking r WHERE r.leagueId = ? ORDER BY total_points DESC";
        const [rankings] = await connection.execute(query, [leagueId]);

        res.status(200).json(rankings);
    } catch (error) {
        console.error("Erreur lors de la récupération du classement:", error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    } finally {
        if (connection) {
            await connection.end();
        }
    }
};

module.exports = ranking;
