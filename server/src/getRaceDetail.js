const mysql = require("mysql2/promise");
const config = require("../config/mysqlConfig.json");

const getRaceDetail = async (req, res) => {
    let connection;
    try {
        connection = await mysql.createConnection(config);

        const raceId = req.params.idRace;
        const query = "SELECT competition, name, step, date_start, date_end, category FROM races WHERE raceId = ?";
        const [raceDetails] = await connection.execute(query, [raceId]);

        if (raceDetails.length === 0) {
            res.status(404).json({ message: "Détails de la course non trouvés" });
        } else {
            res.status(200).json(raceDetails[0]);
        }
    } catch (error) {
        console.error("Erreur lors de la récupération des détails de la course:", error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    } finally {
        if (connection) {
            await connection.end();
        }
    }
};

module.exports = getRaceDetail;