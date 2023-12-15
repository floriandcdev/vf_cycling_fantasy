const mysql = require("mysql2/promise");
const config = require("../config/mysqlConfig.json");

const getRaceRanking = async (req, res) => {
    let connection;
    try {
        connection = await mysql.createConnection(config);
        
        const raceId = req.params.idRace;
        const query = `
            SELECT r.position, c.name AS rider_name, r.points
            FROM race_ranking r
            INNER JOIN cyclists c ON r.cyclistId = c.cyclistId
            WHERE r.raceId = ?
            ORDER BY r.position`;

        const [rankings] = await connection.execute(query, [raceId]);

        if (rankings.length === 0) {
            res.status(404).json({ message: "Classement de la course non trouvé" });
        } else {
            res.status(200).json(rankings);
        }
    } catch (error) {
        console.error("Erreur lors de la récupération du classement de la course:", error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    } finally {
        if (connection) {
            await connection.end();
        }
    }
};

module.exports = getRaceRanking;