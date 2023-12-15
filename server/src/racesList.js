const mysql = require("mysql2/promise");
const config = require("../config/mysqlConfig.json");

const racesList = async (req, res) => {
    let connection;
    try {
        connection = await mysql.createConnection(config);

        const query = "SELECT * FROM races ORDER BY date_start";
        const [races] = await connection.execute(query);

        res.status(200).json(races);
    } catch (error) {
        console.error("Erreur lors de la récupération des courses:", error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    } finally {
        if (connection) {
            await connection.end();
        }
    }
};

module.exports = racesList;