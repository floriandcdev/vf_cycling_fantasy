const mysql = require("mysql2/promise");
const config = require("../config/mysqlConfig.json");

const cyclistsList = async (req, res) => {
    const leagueId = req.params.leagueId === "1" ? 1 : 0;

    let connection;

    try {
        connection = await mysql.createConnection(config);

        const query = "SELECT * FROM cyclists c WHERE c.leagueId = ? ";
        const [cyclists] = await connection.execute(query, [leagueId]);

        res.status(200).json(cyclists);
    } catch (error) {
        console.error("Erreur lors de la récupération des coureurs:", error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    } finally {
        if (connection) {
            await connection.end();
        }
    }
};

module.exports = cyclistsList;