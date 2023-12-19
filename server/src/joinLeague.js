const mysql = require("mysql2/promise");
const config = require("../config/mysqlConfig.json");

const joinLeague = async (req, res) => {
    const leagueLabel = req.params.leagueLabel;

    let connection;

    try {
        connection = await mysql.createConnection(config);

        const query = "SELECT * FROM leagues WHERE leagueLabel = ?";
        const [league] = await connection.execute(query, [leagueLabel]);

        if (league.length === 0) {
            return res.status(404).json({ message: "Ligue introuvable" });
        }

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