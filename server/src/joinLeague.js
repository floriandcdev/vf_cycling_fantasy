const mysql = require("mysql2/promise");
const config = require("../config/mysqlConfig.json");

const joinLeague = async (req, res) => {
    const leagueId = parseInt(req.params.leagueId, 10);
    if (isNaN(leagueId)) {
        return res.status(400).send("Invalid leagueId");
    }

    let connection;

    try {
        connection = await mysql.createConnection(config);

        const query = "SELECT * FROM leagues WHERE leagueId = ?";
        const [league] = await connection.execute(query, [leagueId]);

        if (league.length === 0) {
            return res.status(404).json({ message: "Ligue introuvable" });
        }

        res.status(200).json({ message: "Rejoint la ligue avec succès" });
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