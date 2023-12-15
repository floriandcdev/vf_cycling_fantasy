const mysql = require("mysql2/promise");
const config = require("../config/mysqlConfig.json");

const getScale = async (req, res) => {
    let connection;
    try {
        connection = await mysql.createConnection(config);

        const query = `SELECT r.name, s.position, s.quoting_awarded FROM races r JOIN scale s ON s.category=r.category`;
        const [results] = await connection.execute(query);

        if (results.length === 0) {
            res.status(404).json({ message: "Données de classement non trouvées" });
        } else {
            const scales = results.reduce((acc, row) => {
                if (!acc[row.name]) {
                    acc[row.name] = {};
                }
                acc[row.name][`position${row.position}`] = row.quoting_awarded;
                return acc;
            }, {});

            res.status(200).json(scales);
        }
    } catch (error) {
        console.error("Erreur lors de la récupération des données de classement:", error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    } finally {
        if (connection) {
            await connection.end();
        }
    }
};

module.exports = getScale;