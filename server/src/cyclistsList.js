const mysql = require("mysql2/promise");
const config = require("../config/mysqlConfig.json");

const cyclistsList = async (req, res) => {
    const cyclistGroupId = parseInt(req.params.teamId, 10);

    let connection;

    try {
        connection = await mysql.createConnection(config);

        let cyclists;

        if (cyclistGroupId === 0) {
            const query = "SELECT * FROM cyclists";
            [cyclists] = await connection.execute(query);
        } else {
            const query = "SELECT * FROM cyclists c WHERE c.cyclistGroupId = ? ";
            [cyclists] = await connection.execute(query, [cyclistGroupId]);
        }

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